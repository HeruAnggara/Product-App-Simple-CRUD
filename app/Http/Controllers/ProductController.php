<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::paginate(10);
        return Inertia::render('Dashboard', [
            'products' => $products,
            'success' => session('success')
        ]);
    }

    public function create()
    {
        return Inertia::render('ProductCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        Product::create($validated);
        return redirect()->route('products.index')->with('success', 'Produk dibuat!');
    }

    public function edit(Product $product)
    {
        return Inertia::render('ProductEdit', ['product' => $product]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);
        return redirect()->route('products.index')->with('success', 'Produk diperbarui!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Produk dihapus!');
    }

    public function sync()
{
    $response = Http::get('https://fakestoreapi.com/products');
    $products = $response->json();

    foreach ($products as $item) {
        Product::updateOrCreate(
            ['id' => $item['id']],
            [
                'name' => $item['title'],
                'price' => $item['price'],
                'stock' => rand(1, 100),
                'description' => $item['description'],
            ]
        );
    }

    return redirect()->route('products.index')->with('success', 'Produk disinkronkan!');
}
}