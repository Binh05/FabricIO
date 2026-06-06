import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const GameReview = () => {
  const { draft, addGame, updateGame, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  if (!draft) {
    return (
      <section className="section">
        <div className="panel empty-state">
          <h2>Chưa có dữ liệu xem trước</h2>
          <p className="muted-text">Hãy tạo hoặc chỉnh sửa game trước khi mở trang review.</p>
          <div className="toolbar" style={{ justifyContent: "center" }}>
            <Link className="primary-button" to="/submit-game">Tạo game mới</Link>
          </div>
        </div>
      </section>
    );
  }

  const handlePublish = () => {
    if (editId) {
      updateGame(Number(editId), { ...draft, status: "new" });
      showToast("Đã lưu thay đổi game");
    } else {
      addGame({ ...draft, status: "new" });
      showToast("Đăng game thành công");
    }
    navigate("/games");
  };

  return (
    <>
      <section className="section preview-hero">
        <div className="section-head">
          <div>
            <span className="eyebrow">{editId ? "Edit Preview" : "Before Publish"}</span>
            <h1 className="page-title">{editId ? "Xem trước và chỉnh sửa game" : "Xem trước game trước khi đăng"}</h1>
            <p>Đây là cách người chơi sẽ nhìn thấy trang game của bạn.</p>
          </div>
          <div className="toolbar">
            <Link className="ghost-button ghost-outline" to={`/submit-game${editId ? `?edit=${editId}` : ""}`}>Quay lại chỉnh sửa</Link>
            <button className="primary-button" onClick={handlePublish}>{editId ? "Lưu thay đổi" : "Đăng game"}</button>
          </div>
        </div>

        <div className="panel preview-banner">
          <img src={draft.heroImage} alt={draft.title} />
          <div className="preview-overlay">
            <div className="tag accent">{draft.status || "preview"}</div>
            <h1>{draft.title}</h1>
            <div className="meta">by {draft.developer}</div>
            <div className="meta-row">
              <span className={`price ${draft.price === 0 ? "free" : "paid"}`}>{draft.price === 0 ? "Free" : `$${draft.price}`}</span>
              {draft.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="detail-layout">
          <div className="detail-header">
            <div className="panel detail-panel">
              <h2>Giới thiệu ngắn</h2>
              <p className="feed-content">{draft.description}</p>
            </div>
            <div className="panel detail-panel">
              <h2>Mô tả chi tiết</h2>
              <p className="feed-content">{draft.longDescription}</p>
            </div>
            {draft.gallery?.length > 0 && (
              <div className="panel detail-panel">
                 <h2>Ảnh show game</h2>
                 <div className="preview-gallery">
                   {draft.gallery.map((img, i) => <img key={i} src={img} alt="screenshot" />)}
                 </div>
              </div>
            )}
          </div>
          <aside className="detail-sidebar">
            <div className="panel detail-panel">
              <h2>Thông tin phát hành</h2>
              <ul className="summary-list">
                <li><strong>Nền tảng:</strong> {draft.platform}</li>
                <li><strong>Giá:</strong> {draft.price === 0 ? "Free" : `$${draft.price}`}</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};
