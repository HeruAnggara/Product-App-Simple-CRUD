import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

export default function ProductCreate() {
  const { data, setData, post, errors } = useForm({
    name: '', price: '', stock: '', description: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('products.store'));
  };

  return (
    <>
      <Head title="Add New Product" />
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex justify-center items-start">
        <div className="w-full max-w-2xl mt-10">
            
            {/* Card Kontainer Utama */}
            <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 ring-1 ring-gray-200">
                
                {/* Header */}
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">
                    Add New Product
                </h1>

                {/* Formulir */}
                <form onSubmit={submit} className="space-y-6">
                    
                    {/* Field Nama */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Produk
                        </label>
                        <input 
                            id="name"
                            type="text" 
                            value={data.name} 
                            onChange={e => setData('name', e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
                            placeholder="Masukkan nama produk"
                        />
                        {errors.name && <span className="mt-1 text-sm text-red-600">{errors.name}</span>}
                    </div>

                    {/* Field Harga */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Harga
                            </label>
                            <input 
                                id="price"
                                type="number" 
                                value={data.price} 
                                onChange={e => setData('price', e.target.value)} 
                                className="flex-1 p-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
                                placeholder="Contoh: 150.000"
                            />
                            {errors.price && <span className="mt-1 text-sm text-red-600">{errors.price}</span>}
                        </div>

                        {/* Field Stok */}
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                Stok
                            </label>
                            <input 
                                id="stock"
                                type="number" 
                                value={data.stock} 
                                onChange={e => setData('stock', e.target.value)} 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
                                placeholder="Jumlah stok"
                            />
                            {errors.stock && <span className="mt-1 text-sm text-red-600">{errors.stock}</span>}
                        </div>
                    </div>

                    {/* Field Deskripsi */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea 
                            id="description"
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)} 
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-y" 
                            placeholder="Jelaskan detail produk secara singkat dan jelas..."
                        />
                        {errors.description && <span className="mt-1 text-sm text-red-600">{errors.description}</span>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="pt-4 flex justify-end space-x-3 border-t">
                        <Link 
                            href={route('products.index')} 
                            className="px-6 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                        >
                            Kembali
                        </Link>
                        <button 
                            type="submit" 
                            className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </>
  );
}