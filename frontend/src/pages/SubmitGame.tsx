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
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Creator Upload</span>
          <h1 className="page-title">{editingGame ? "Chỉnh sửa game" : "Đăng game mới lên cửa hàng"}</h1>
          <p>Tải build cho Windows, Android hoặc WebGL, thêm ảnh đại diện, ảnh show game, video YouTube, tag và giá bán.</p>
        </div>
      </div>
      <div className="submit-layout">
        <form className="panel form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field-group">
              <label>Tên game</label>
              <input className="input" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="field-group">
              <label>Studio / Nhà phát triển</label>
              <input className="input" name="developer" value={formData.developer} onChange={handleChange} required />
            </div>
            <div className="field-group">
              <label>Loại build</label>
              <select className="select" name="platform" value={formData.platform} onChange={handleChange} required>
                <option value="windows">Windows (.zip)</option>
                <option value="android">Android (.apk)</option>
                <option value="webgl">WebGL (.zip)</option>
              </select>
            </div>
            <div className="field-group">
              <label>Giá game (USD)</label>
              <input className="input" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="field-group form-grid-full">
              <label>Mô tả ngắn</label>
              <textarea className="input textarea" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="field-group form-grid-full">
              <label>Mô tả chi tiết</label>
              <textarea className="input textarea" name="longDescription" value={formData.longDescription} onChange={handleChange} required />
            </div>
            <div className="field-group form-grid-full">
              <label>File game</label>
              <div className="file-drop">
                <input className="input" type="file" onChange={(e) => handleFileChange(e, 'build')} />
                <div className="file-note">{fileNotes.build}</div>
              </div>
            </div>
            <div className="field-group">
              <label>Ảnh đại diện game</label>
              <div className="file-drop">
                <input className="input" type="file" onChange={(e) => handleFileChange(e, 'cover')} />
                <div className="file-note">{fileNotes.cover}</div>
              </div>
            </div>
            <div className="field-group">
              <label>Ảnh show game</label>
              <div className="file-drop">
                <input className="input" type="file" multiple onChange={(e) => handleFileChange(e, 'gallery')} />
                <div className="file-note">{fileNotes.gallery}</div>
              </div>
            </div>
            <div className="field-group form-grid-full">
              <label>Link YouTube</label>
              <input className="input" name="video" value={formData.video} onChange={handleChange} />
            </div>
            <div className="field-group form-grid-full">
              <label>Tag game</label>
              <div className="tag-selector">
                {ALL_TAGS.map((tag: string) => (
                  <label key={tag} className="tag-option">
                    <input type="checkbox" name="tags" value={tag} checked={formData.tags.includes(tag)} onChange={handleChange} />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
              <input className="input" name="customTags" placeholder="Tag tùy chọn..." value={formData.customTags} onChange={handleChange} />
            </div>
          </div>
          <div className="toolbar">
            <button className="primary-button" type="submit">{editingGame ? "Cập nhật xem trước" : "Xem trước game"}</button>
            <Link className="ghost-button ghost-outline" to="/games">Quay lại thư viện</Link>
          </div>
        </form>
        <aside className="panel detail-panel">
          <h2>Preview Status</h2>
          <ul className="preview-list">
            <li>Nền tảng: {formData.platform}</li>
            <li>Giá: {formData.price === 0 ? "Free" : `$${formData.price}`}</li>
            <li>Tags: {formData.tags.join(", ") || "None"}</li>
          </ul>
        </aside>
      </div>
    </section>
  );
};
