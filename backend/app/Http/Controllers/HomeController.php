<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use App\Models\Goal;
use App\Models\Transaction;

class HomeController extends Controller
{
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
}


