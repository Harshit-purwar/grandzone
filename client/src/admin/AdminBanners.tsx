import { useState, useEffect } from 'react';
import { adminGetBanners, createBanner, updateBanner, deleteBanner, uploadImage } from '../api';
import { Banner } from '../types';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';

const bgOptions = [
  { label: 'Green', value: 'from-primary-500 to-primary-700' },
  { label: 'Yellow', value: 'from-secondary-400 to-secondary-600' },
  { label: 'Blue', value: 'from-blue-500 to-blue-700' },
  { label: 'Purple', value: 'from-purple-500 to-purple-700' },
  { label: 'Red', value: 'from-red-500 to-red-700' },
  { label: 'Orange', value: 'from-orange-400 to-orange-600' },
  { label: 'Pink', value: 'from-pink-500 to-pink-700' },
  { label: 'Teal', value: 'from-teal-500 to-teal-700' },
];

export const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', bgColor: 'from-primary-500 to-primary-700', link: '', order: '0', active: true });
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    const res = await adminGetBanners();
    setBanners(res.data);
  };

  useEffect(() => { fetchBanners(); }, []);

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle || '', bgColor: b.bgColor, link: b.link || '', order: String(b.order), active: b.active });
    setImage(b.image || '');
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setImage(res.data.url);
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, image: image || null, order: Number(form.order) };
    if (editing) {
      await updateBanner(editing.id, data);
    } else {
      await createBanner(data);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', subtitle: '', bgColor: 'from-primary-500 to-primary-700', link: '', order: '0', active: true });
    setImage('');
    fetchBanners();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this banner?')) {
      await deleteBanner(id);
      fetchBanners();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Offer Banners</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FiPlus /> Add Banner
        </button>
      </div>

      {/* Banner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Banner</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Preview */}
            <div className={`bg-gradient-to-r ${form.bgColor} rounded-xl p-4 mb-4`}>
              <h3 className="text-xl font-bold text-white">{form.title || 'Banner Title'}</h3>
              {form.subtitle && <p className="text-white/90 text-sm">{form.subtitle}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Banner Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
              <input placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
              <input placeholder="Link URL (optional)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Background Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {bgOptions.map(bg => (
                    <button
                      key={bg.value}
                      type="button"
                      onClick={() => setForm({ ...form, bgColor: bg.value })}
                      className={`bg-gradient-to-r ${bg.value} h-10 rounded-lg text-white text-xs font-medium ${form.bgColor === bg.value ? 'ring-2 ring-offset-2 ring-primary-600' : ''}`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Order (0 = first)" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500" />
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-5 h-5 text-primary-600 rounded" />
                  <span className="text-sm text-gray-600">Active</span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Banner Image (optional)</label>
                {image && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImage('')} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">×</button>
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <FiUpload /> <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-bold transition-colors">
                {editing ? 'Update' : 'Create'} Banner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className={`bg-gradient-to-r ${banner.bgColor} p-4`}>
              <h3 className="text-lg font-bold text-white">{banner.title}</h3>
              {banner.subtitle && <p className="text-white/80 text-sm">{banner.subtitle}</p>}
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${banner.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Order: {banner.order}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(banner)} className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="text-center text-gray-500 py-8">No banners yet. Add your first offer banner!</p>
        )}
      </div>
    </div>
  );
};
