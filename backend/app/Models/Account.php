<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = ['name', 'balance', 'user_id', 'type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
