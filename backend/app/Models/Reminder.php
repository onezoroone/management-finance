<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $table = 'reminders';

    protected $fillable = [
        'user_id',
        'content',
        'reminder_date',
        'repeat_type',
        'status'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
