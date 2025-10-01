import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Dashboard({ products, success }) {
    const handleDelete = (productId, productName) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            html: `Anda akan menghapus produk: <strong>${productName}</strong>. Aksi ini tidak dapat dibatalkan!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('products.destroy', productId), {
                    onSuccess: () => {
                        Swal.fire(
                            'Dihapus!',
                            `Produk "${productName}" berhasil dihapus.`,
                            'success'
                        );
                    },
                    onError: (errors) => {
                        Swal.fire(
                            'Gagal!',
                            'Terjadi kesalahan saat menghapus produk.',
                            'error'
                        );
                        console.error(errors);
                    }
                });
            }
        });
    };
    return (
        <>
            <Head title="Dashboard" />

            <div className="p-4 md:p-8 bg-gray-50 min-h-screen antialiased">
              <div className="max-w-7xl mx-auto">

                  {/* Header dan Tombol Aksi */}
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                      <h1 className="text-3xl font-extrabold text-gray-800 border-l-4 border-indigo-600 pl-3">
                          Product List
                      </h1>
                      <div className="flex space-x-3">
                          <Link 
                              href={route('products.create')} 
                              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                              Add Product
                          </Link>
                          <Link 
                              href={route('products.sync')} 
                              method="post" 
                              className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H6a1 1 0 010-2H4a1 1 0 01-1-1zm14 7a1 1 0 011 1v2.101A7.002 7.002 0 016.399 17.566 1 1 0 014.514 16.9a5.002 5.002 0 0010.091-2.566H14a1 1 0 110-2h2a1 1 0 011 1z" /></svg>
                              Sync Products
                          </Link>
                      </div>
                  </div>

                  {success && (
                      <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-2 rounded-md shadow-md">
                          {success}
                      </div>
                  )}

                  {/* Tabel dalam Card */}
                  <div className="bg-white shadow-xl rounded-xl overflow-hidden ring-1 ring-gray-200">
                      <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                  <tr>
                                      <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                      <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                                      <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga</th>
                                      <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stok</th>
                                      <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deskripsi</th>
                                      <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {products.data.length === 0 && (
                                      <tr>
                                          <td colSpan="6" className="p-6 text-center text-gray-500 italic">
                                              Tidak ada produk yang tersedia.
                                          </td>
                                      </tr>
                                  )}
                                  {products.data.map(product => (
                                      <tr key={product.id} className="hover:bg-indigo-50 transition duration-150">
                                          <td className="p-4 text-sm font-medium text-gray-900">{product.id}</td>
                                          <td className="p-4 text-sm font-medium text-gray-900">{product.name}</td>
                                          <td className="p-4 text-sm text-gray-600 font-mono">${product.price}</td>
                                          <td className="p-4 text-sm text-gray-600">
                                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                  {product.stock}
                                              </span>
                                          </td>
                                          <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{product.description.substring(0, 75)}...</td>
                                          <td className="p-4 text-center whitespace-nowrap space-x-2">
                                              <Link 
                                                  href={route('products.edit', product.id)} 
                                                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
                                              >
                                                  Edit
                                              </Link>
                                              <span className="text-gray-300">|</span>
                                              <button 
                                                onClick={() => handleDelete(product.id, product.name)}
                                                type="button" 
                                                className="text-red-600 hover:text-red-800 font-medium text-sm hover:underline"
                                            >
                                                Delete
                                            </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex justify-end items-center space-x-3">
                      {products.prev_page_url && (
                          <Link 
                              href={products.prev_page_url} 
                              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                          >
                              &larr; Previous
                          </Link>
                      )}
                      {products.next_page_url && (
                          <Link 
                              href={products.next_page_url} 
                              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md"
                          >
                              Next &rarr;
                          </Link>
                      )}
                  </div>
              </div>
          </div>
        </>
    );
}
