<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_name')->after('user_id');
            $table->string('customer_phone')->after('customer_name');
            $table->string('customer_email')->after('customer_phone');
            $table->text('note')->nullable()->after('payment_method');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'customer_phone', 'customer_email', 'note']);
        });
    }
};
