<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\Account;
use GuzzleHttp\Client;

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
}


