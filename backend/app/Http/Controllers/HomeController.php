<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use GuzzleHttp\Client;

class HomeController extends Controller
{
    public function getMessages(Request $request){
        $model = $request->model;
        $prompt = $request->prompt;
        $user = $request->user();
        if($model == 'groq'){
            if(!$prompt){
                $transactions = Transaction::where('user_id', $user->id)->get();
                $prompt = "Bạn là một cố vấn tài chính cá nhân. Dưới đây là lịch sử giao dịch của người dùng:\n";
                foreach($transactions as $transaction){
                    $prompt .= "Ngày: " . $transaction->date . "\n";
                    $prompt .= "Loại: " . $transaction->type . "\n";
                    $prompt .= "Số tiền: " . $transaction->amount . "\n";
                    $prompt .= "Mô tả: " . $transaction->description . "\n";
                }
                $prompt .= "\nHãy đưa ra gợi ý giúp người dùng phân tích và dự báo xu hướng chi tiêu. Phản hồi bằng tiếng Việt.";
            }

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
}


