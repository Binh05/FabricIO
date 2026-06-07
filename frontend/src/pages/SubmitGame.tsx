import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const SubmitGame = () => {
  const { user, games, draft, setDraft, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const editingGame = editId ? games.find(g => g.id === Number(editId)) : null;

  const [formData, setFormData] = useState({
    title: "",
    developer: user.name,
    platform: "windows",
    price: 0,
    description: "",
    longDescription: "",
    video: "",
    tags: [],
    customTags: "",
    ...editingGame,
    ...(editId ? {} : draft)
  });

  const [fileNotes, setFileNotes] = useState({
    build: "Chưa chọn file game.",
    cover: "Chưa chọn ảnh đại diện.",
    gallery: "Chưa chọn ảnh show game."
  });

  const ALL_TAGS = [...new Set(games.flatMap((game) => game.tags))];

  useEffect(() => {
    if (editingGame) {
      setFormData(prev => ({ ...prev, ...editingGame }));
    }
  }, [editingGame]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "tags") {
      setFormData(prev => ({
        ...prev,
        tags: checked ? [...prev.tags, value] : prev.tags.filter(t => t !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, key) => {
    const files = e.target.files;
    const note = files.length === 1 ? files[0].name : `${files.length} files selected`;
    setFileNotes(prev => ({ ...prev, [key]: note }));
    
    // In a real app we'd upload these. For mock, we'll use object URLs or just notes.
    if (files.length > 0) {
      if (key === 'cover') {
        setFormData(prev => ({ ...prev, heroImage: URL.createObjectURL(files[0]) }));
      }
      if (key === 'gallery') {
         setFormData(prev => ({ ...prev, gallery: Array.from(files).map((f: Blob | MediaSource) => URL.createObjectURL(f)) }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const youtubeEmbedUrl = (input) => {
      if (!input) return "";
      try {
        const url = new URL(input);
        if (url.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${url.pathname.replace("/", "")}`;
        if (url.hostname.includes("youtube.com")) return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
      } catch (e) {}
      return input;
    };

    const finalTags = [...new Set([...formData.tags, ...(formData.customTags ? formData.customTags.split(",").map(t => t.trim()) : [])])];
    
    const payload = {
      ...formData,
      id: editingGame?.id || Date.now(),
      tags: finalTags,
      video: youtubeEmbedUrl(formData.video),
      rawVideo: formData.video,
      isCustom: true,
      status: editingGame?.status || "preview",
      downloads: editingGame?.downloads || 0,
      views: editingGame?.views || 0,
      rating: editingGame?.rating || 0
    };

    setDraft(payload);
    showToast("Đã cập nhật trang xem trước");
    navigate(`/game-review${editId ? `?edit=${editId}` : ""}`);
  };

  return (
    <section className="mb-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-primary font-bold uppercase text-[13px] tracking-[2px] mb-2 block">Creator Upload</span>
          <h1 className="text-4xl font-extrabold tracking-tight">{editingGame ? "Chỉnh sửa game" : "Đăng game mới lên cửa hàng"}</h1>
          <p className="text-muted">Tải build cho Windows, Android hoặc WebGL, thêm ảnh đại diện, ảnh show game, video YouTube, tag và giá bán.</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        <form className="bg-card border border-border rounded-lg p-6 flex-1" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="block font-semibold text-sm">Tên game</label>
              <input className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block font-semibold text-sm">Studio / Nhà phát triển</label>
              <input className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary" name="developer" value={formData.developer} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block font-semibold text-sm">Loại build</label>
              <select className="w-full bg-black/20 border border-border p-3 text-white rounded-xl outline-none focus:border-primary" name="platform" value={formData.platform} onChange={handleChange} required>
                <option value="windows">Windows (.zip)</option>
                <option value="android">Android (.apk)</option>
                <option value="webgl">WebGL (.zip)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block font-semibold text-sm">Giá game (USD)</label>
              <input className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block font-semibold text-sm">Mô tả ngắn</label>
              <textarea className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary min-h-[120px]" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block font-semibold text-sm">Mô tả chi tiết</label>
              <textarea className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary min-h-[120px]" name="longDescription" value={formData.longDescription} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block font-semibold text-sm">File game</label>
              <div className="border-2 border-dashed border-border p-6 rounded-xl text-center relative">
                <input className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary" type="file" onChange={(e) => handleFileChange(e, 'build')} />
                <div className="text-[12px] text-muted mt-2">{fileNotes.build}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block font-semibold text-sm">Ảnh đại diện game</label>
              <div className="border-2 border-dashed border-border p-6 rounded-xl text-center relative">
                <input className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary" type="file" onChange={(e) => handleFileChange(e, 'cover')} />
                <div className="text-[12px] text-muted mt-2">{fileNotes.cover}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block font-semibold text-sm">Ảnh show game</label>
              <div className="border-2 border-dashed border-border p-6 rounded-xl text-center relative">
                <input className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary" type="file" multiple onChange={(e) => handleFileChange(e, 'gallery')} />
                <div className="text-[12px] text-muted mt-2">{fileNotes.gallery}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block font-semibold text-sm">Link YouTube</label>
              <input className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary" name="video" value={formData.video} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block font-semibold text-sm">Tag game</label>
              <div className="flex flex-wrap gap-2.5 mb-3">
                {ALL_TAGS.map((tag: string) => (
                  <label key={tag} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg cursor-pointer text-sm">
                    <input type="checkbox" name="tags" value={tag} checked={formData.tags.includes(tag)} onChange={handleChange} />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
              <input className="w-full bg-black/20 border border-border px-4 py-3 text-white rounded-xl outline-none focus:border-primary" name="customTags" placeholder="Tag tùy chọn..." value={formData.customTags} onChange={handleChange} />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button className="bg-linear-to-br from-primary to-primary-glow text-white border-none py-3 px-6 rounded-sm font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 shadow-[0_10px_20px_rgba(255,71,71,0.2)] inline-flex items-center justify-center" type="submit">{editingGame ? "Cập nhật xem trước" : "Xem trước game"}</button>
            <Link className="px-5 py-2.5 rounded-sm text-muted font-semibold transition-all duration-200 bg-transparent border border-border cursor-pointer hover:bg-white/5 hover:text-white inline-flex items-center justify-center" to="/games">Quay lại thư viện</Link>
          </div>
        </form>
        <aside className="bg-card border border-border rounded-lg p-6 w-full lg:w-[320px] h-fit sticky top-[120px]">
          <h2 className="text-xl font-bold mb-4">Preview Status</h2>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            <li>Nền tảng: <span className="text-white font-medium">{formData.platform}</span></li>
            <li>Giá: <span className="text-white font-medium">{formData.price === 0 ? "Free" : `$${formData.price}`}</span></li>
            <li>Tags: <span className="text-white font-medium">{formData.tags.join(", ") || "None"}</span></li>
          </ul>
        </aside>
      </div>
    </section>
  );
};
