import { useState, useEffect } from 'react';
import { adminGetCategories, createCategory, updateCategory, deleteCategory } from '../api';
import { Category } from '../types';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

export const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    const res = await adminGetCategories();
    setCategories(res.data);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateCategory(editing.id, { name });
    } else {
      await createCategory({ name });
    }
    setShowForm(false);
    setEditing(null);
    setName('');
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Category</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); setName(''); }} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Category Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-bold transition-colors">
                {editing ? 'Update' : 'Create'} Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">{cat.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="text-blue-600 p-1 hover:bg-blue-50 rounded"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(cat.id)} className="text-red-600 p-1 hover:bg-red-50 rounded"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-sm text-gray-500">{cat._count?.products || 0} products</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${cat.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {cat.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
