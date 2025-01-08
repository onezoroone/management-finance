<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

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
}


