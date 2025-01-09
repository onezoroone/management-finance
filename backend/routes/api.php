<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('transaction', [HomeController::class, 'getTransactions']);
    Route::get('account', [HomeController::class, 'getAccounts']);
    Route::post('account', [HomeController::class, 'addAccount']);
    Route::get('dashboard', [HomeController::class, 'getDashboard']);
    Route::post('transaction', [HomeController::class, 'addTransaction']);
});