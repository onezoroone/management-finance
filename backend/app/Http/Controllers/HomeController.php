<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\Account;
use App\Models\User;
use GuzzleHttp\Client;
use App\Models\Goal;
use App\Models\Reminder;

class HomeController extends Controller
{
    public function getTransactions(Request $request)
    {
        $user = $request->user();
        $transactions = Transaction::where('user_id', $user->id)->with('category', 'account')->orderByDesc('date')->get();
        $categories = Category::all();
        return response()->json([
            'transactions' => $transactions,
            'categories' => $categories
        ]);
    }

    public function getAccounts(Request $request)
    {
        $user = $request->user();
        $accounts = Account::where('user_id', $user->id)->get();
        return response()->json([
            'accounts' => $accounts
        ]);
    }

    public function addAccount(Request $request)
    {
        $user = $request->user();

        // Lấy api key access từ PAYLOAD
        $apiKeyAccess = $request->api_key_access;

        // Gán header cho request
        $client = new Client([
            'headers' => [
                'Authorization' => 'Bearer ' . $apiKeyAccess,
                'Content-Type' => 'application/json',
            ]
        ]);

        // Lấy dữ liệu từ API
        $response = $client->request('GET', 'https://my.sepay.vn/userapi/transactions/list?limit=1');
        $data = json_decode($response->getBody(), true);

        // Nếu API trả về status 200 thì lưu api key access vào database và lấy danh sách ngân hàng
        if($data['status'] == 200){
            $user->api_key_access = $apiKeyAccess;
            $user->save();

            // Kiểm tra xem có giao dịch nào tồn tại không
            $transaction = $data['transactions'][0] ?? null;
            if($transaction){
                // Kiểm tra account đã tồn tại chưa
                $checkAccount = Account::where('user_id', $user->id)->where('name', $transaction['bank_brand_name'])->first();
                if(!$checkAccount){
                    $account = new Account();
                    $account->user_id = $user->id;
                    $account->name = $transaction['bank_brand_name'] . ' - ' . $transaction['account_number'];
                    $account->type = 'bank';
                    $account->save();
                }
            }
        }

        return response()->json([
            'message' => 'Thêm ví thành công'
        ]);
    }

    public function getDashboard(Request $request){
        $user = $request->user();

        $totalIncome = Transaction::where('user_id', $user->id)->where('type', 'income')->sum('amount');
        $totalExpense = Transaction::where('user_id', $user->id)->where('type', 'expense')->sum('amount');
        $totalSaving = $totalIncome - $totalExpense;

        $categories = Category::all();
        return response()->json([
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'totalSaving' => $totalSaving,
            'categories' => $categories
        ]);
    }

    public function addTransaction(Request $request){
        $category = Category::where('name', $request->category)->first();
        $user = $request->user();
        $transaction = new Transaction();
        $transaction->user_id = $user->id;
        $transaction->category_id = $category->id;
        $transaction->amount = $request->amount;
        $transaction->description = $request->note;
        $transaction->date = now();
        $transaction->type = $request->type;
        $transaction->save();
    }

    public function getMessages(Request $request){
        $model = $request->model;
        $prompt = $request->prompt;
        $user = $request->user();
        if($model == 'groq'){
            $transactions = Transaction::where('user_id', $user->id)->limit(50)->orderByDesc('created_at')->get();
            $prompt .= ".Dưới đây là lịch sử giao dịch của tôi cho bạn tham khảo:\n";
            foreach($transactions as $transaction){
                $prompt .= "Ngày: " . $transaction->date . "\n";
                $prompt .= "Loại: " . $transaction->type . "\n";
                $prompt .= "Số tiền: " . $transaction->amount . "\n";
                $prompt .= "Mô tả: " . $transaction->description . "\n";
            }

            $prompt .= "\nHãy đưa ra gợi ý giúp tôi phân tích và dự báo xu hướng chi tiêu. Phản hồi bằng tiếng Việt.";

            $client = new Client();
            $response = $client->request('POST', 'https://api.groq.com/openai/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer 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',
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a financial advisor.'],
                        ['role' => 'user', 'content' => $prompt]
                    ]
                ]
            ]);

            $body = json_decode($response->getBody(), true);
            $message = $body['choices'][0]['message']['content'];

            $result = (object)[
                    'role' => 'assistant',
                    'content' => $message,
                    'time' => now()->format('H:i')
                ];
            return response()->json($result);
        }else{
            $response = (object)[
                    'role' => 'assistant',
                    'content' => 'ChatGPT hiện không hoạt động',
                    'time' => now()->format('H:i')
                ];
            return response()->json($response);
        }
    }

    public function getGoals(Request $request){
        $user = $request->user();
        $goals = Goal::where('user_id', $user->id)->orderByDesc('created_at')->get();
        return response()->json($goals);
    }

    public function addGoal(Request $request){
        $client = new Client();

        // thêm mục tiêu
        $user = $request->user();
        $goal = new Goal();
        $goal->user_id = $user->id;
        $goal->name = $request->name;
        $goal->target_amount = $request->target_amount;
        $goal->current_amount = 0;
        $goal->deadline = $request->deadline;
        $goal->save();

        // Lấy 10 lịch sử giao dịch chi tiêu gần đây
        $transactions = Transaction::where('user_id', $user->id)->orderByDesc('date')->limit(10)->get();

        // Tạo prompt cho chatbot
        $prompt = "Người dùng đang tiết kiệm cho mục tiêu: '{$goal->name}' với số tiền mục tiêu là {$goal->target_amount} VND.
        Thời hạn hoàn thành là ngày {$goal->deadline}.
        Dây là lịch sử chi tiêu của người dùng:
        ";
        foreach($transactions as $transaction){
            $prompt .= "Ngày: " . $transaction->date . "\n";
            $prompt .= "Số tiền: " . $transaction->amount . " VND\n";
            $prompt .= "Loại: " . $transaction->type == 'income' ? 'Thu nhập' : 'Chi tiêu' . "\n";
            $prompt .= "Mô tả: " . $transaction->description . "\n";
        }
        $prompt .= "\nHãy đưa ra lời khuyên giúp họ đạt được mục tiêu đúng hạn. Phản hồi bằng tiếng Việt.";

        $response = $client->request('POST', 'https://api.groq.com/openai/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer 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',
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a financial advisor.'],
                    ['role' => 'user', 'content' => $prompt]
                ]
            ]
        ]);

        // Lấy nội dung phản hồi
        $body = json_decode($response->getBody(), true);
        $message = $body['choices'][0]['message']['content'] ?? 'Không có lời khuyên nào được đưa ra.';

        return response()->json([
            'goal' => $goal,
            'message' => $message
        ]);
    }

    public function telegramConnect(Request $request){
        $chatId = $request->chat_id;
        $client = new Client();
        $response = $client->request('POST', "https://api.telegram.org/bot7991474032:AAEvyH4ukdeCvonchltqA-clmdbAgSrwLHw/getChat", [
            'query' => [
                'chat_id' => $chatId
            ]
        ]);

        if ($response->getStatusCode() === 200) {
            $data = json_decode($response->getBody(), true);
            if (isset($data['ok']) && $data['ok']) {
                return response()->json([
                    'message' => 'Kết nối thành công',
                    'chat' => $data['result']
                ]);
            }
        }
        return response()->json(['message' => 'Kết nối thất bại']);
    }

    public function telegramAdd(Request $request){
        $chatId = $request->chat_id;
        $user = $request->user();
        $user->group_id = $chatId;
        $user->save();

        return response()->json([
            'message' => 'Thêm id nhóm thành công'
        ]);
    }

    public function getSupersetGuestToken(Request $request){
        $user = $request->user();
        $client = new Client();

        // Khai báo url api superset
        $supersetApiUrl = "https://superset.63httt2.site/api/v1";

        $responseTokenLogin = $client->request('POST', $supersetApiUrl . "/security/login", [
            'json' => [
                'username' => 'guest_user',
                'password' => 'guest_user',
                'provider' => 'db',
                'refresh' => false
            ]
        ]);

        $bodyTokenLogin = json_decode($responseTokenLogin->getBody(), true);
        $token = $bodyTokenLogin['access_token'];

        $responseGetGuestToken = $client->request('POST', $supersetApiUrl . "/security/guest_token/", [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ],
            'json' => [
                'resources' => [
                    [
                        'type' => 'dashboard',
                        'id' => '15cf2ffe-712d-4a9a-b6d4-86cdb8129bad' // ID dashboard
                    ]
                ],
                'user' => [
                    'username' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email
                ],
                'rls' => [
                    [
                        'clause' => 'user_id = ' . $user->id
                    ]
                ]
            ]
        ]);

        $bodyGuestToken = json_decode($responseGetGuestToken->getBody(), true);
        $guestToken = $bodyGuestToken['token'];

        return response()->json($guestToken);
    }

    public function addReminder(Request $request){
        $user = $request->user();
        $reminder = new Reminder();
        $reminder->user_id = $user->id;
        $reminder->content = $request->title;
        $reminder->reminder_date = $request->date;
        $reminder->repeat_type = $request->repeat;
        $reminder->status = 'pending';
        $reminder->save();

        return response()->json([
            'message' => 'Thêm sự kiện thành công!'
        ]);
    }

    public function getReminders(Request $request){
        $user = $request->user();
        $reminders = Reminder::where('user_id', $user->id)->where('status', 'pending')->get();
        return response()->json($reminders);
    }
}


