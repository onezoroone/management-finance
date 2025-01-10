<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean'
        ], [
            'email.required' => 'Không được để trống email',
            'email.email' => 'Email không đúng định dạng',
            'password.required' => 'Không được để trống mật khẩu',
            'remember.boolean' => 'Remember phải là boolean'
        ]);

        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials, $request->remember)) {
            $user = auth()->user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Đăng nhập thành công',
                'user' => $user,
                'token' => $token
            ]);
        }

        return response()->json([
            'message' => 'Email hoặc mật khẩu không chính xác'
        ], 401);
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed'
        ], [
            'first_name.required' => 'Không được để trống họ',
            'last_name.required' => 'Không được để trống tên',
            'email.required' => 'Không được để trống email',
            'email.email' => 'Email không đúng định dạng',
            'password.required' => 'Không được để trống mật khẩu',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'password.confirmed' => 'Mật khẩu không khớp',
            'email.unique' => 'Email đã tồn tại'
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        return response()->json([
            'message' => 'Tạo tài khoản thành công',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công'
        ]);
    }
}
