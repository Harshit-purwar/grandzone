import { useState, useEffect } from 'react';
import { adminGetProducts, adminGetCategories, createProduct, updateProduct, deleteProduct, uploadImage } from '../api';
import { Product, Category } from '../types';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', categoryId: '', brand: '', mrp: '', price: '', discount: '', stock: '' });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([adminGetProducts(), adminGetCategories()]);
    setProducts(prodRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const res = await uploadImage(file);
        setImages(prev => [...prev, res.data.url]);
      }
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', categoryId: p.categoryId, brand: p.brand || '', mrp: String(p.mrp), price: String(p.price), discount: String(p.discount), stock: String(p.stock) });
    setImages(p.images ? JSON.parse(p.images) : []);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, images, mrp: Number(form.mrp), price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock) };
    if (editing) {
      await updateProduct(editing.id, data);
    } else {
      await createProduct(data);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', categoryId: '', brand: '', mrp: '', price: '', discount: '', stock: '' });
    setImages([]);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Product</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500 resize-none" rows={3} />
              <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="MRP" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
                <input required type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
                <input type="number" placeholder="Discount %" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
                <input required type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Images</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <FiUpload /> <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-bold transition-colors">
                {editing ? 'Update' : 'Create'} Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    {p.brand && <p className="text-xs text-gray-500">{p.brand}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category?.name}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary-600">₹{p.price}</p>
                    <p className="text-xs text-gray-400 line-through">₹{p.mrp}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-700 p-1"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700 p-1"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
