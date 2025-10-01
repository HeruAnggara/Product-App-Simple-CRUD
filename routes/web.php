<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('products.index');
});

Route::get('/dashboard', function () {
    return redirect()->route('products.index');
});

Route::resource('products', ProductController::class);
Route::post('products/sync', [ProductController::class, 'sync'])->name('products.sync');

require __DIR__.'/auth.php';
