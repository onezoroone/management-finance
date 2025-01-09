<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use App\Models\Reminder;

class HomeController extends Controller
{
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


