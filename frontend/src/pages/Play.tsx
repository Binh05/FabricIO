import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export const Play = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { games } = useApp();
  const game = games.find(g => g.id === Number(id)) || games[0];
  
  const urlParam = searchParams.get("url");
  const webglUrl = urlParam || game.webglUrl || "";

  const formatCompact = (value) => Intl.NumberFormat("en", { notation: "compact" }).format(value);

  const handleAction = (action) => {
    const frame = document.getElementById("webgl-iframe");
    if (!frame) return;
    if (action === "reload") {
      frame.src = frame.src;
    }
    if (action === "fullscreen") {
      frame.requestFullscreen?.();
    }
  };

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Play</span>
          <h1 className="page-title">{game.title}</h1>
          <p>Trải nghiệm bản WebGL trực tiếp trong trình duyệt.</p>
        </div>
        <Link className="ghost-button ghost-outline" to={`/game-detail/${game.id}`}>Game details</Link>
      </div>

      <div className="player-layout">
        <div>
          {webglUrl ? (
            <>
              <div className="player-frame">
                <iframe
                  id="webgl-iframe"
                  src={webglUrl}
                  title={`${game.title} WebGL`}
                  allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
                />
              </div>
              <div className="player-toolbar">
                <div className="inline-actions">
                  <button className="ghost-button ghost-outline" onClick={() => handleAction("reload")}>Reload</button>
                  <button className="ghost-button ghost-outline" onClick={() => handleAction("fullscreen")}>Fullscreen</button>
                </div>
                <div className="muted-text">Tip: WebGL chạy ổn nhất khi mở qua local server (http://localhost), không phải file://</div>
              </div>
            </>
          ) : (
            <div className="panel empty-state">
              <h2>Game này chưa có link WebGL để chơi</h2>
              <p className="muted-text">Bạn có thể mở trang này với tham số <code>?url=...</code> trỏ tới file <code>index.html</code> của build WebGL (đang được host).</p>
              <div className="toolbar" style={{ justifyContent: "center" }}>
                <Link className="primary-button" to={`/submit-game?edit=${game.id}`}>Thêm link WebGL</Link>
                <Link className="ghost-button ghost-outline" to={`/game-detail/${game.id}`}>Về trang game</Link>
              </div>
            </div>
          )}
        </div>
        <aside className="panel detail-panel">
          <div className="tag accent">{game.status}</div>
          <h2 style={{ marginTop: 12 }}>Thông tin</h2>
          <div className="meta">by {game.developer}</div>
          <div className="meta-row">
            <span className={`price ${game.price === 0 ? "free" : "paid"}`}>{game.price === 0 ? "Free" : `$${game.price}`}</span>
            <span className="tag">{formatCompact(game.views)} views</span>
            <span className="tag">{formatCompact(game.downloads)} downloads</span>
          </div>
          <div className="tag-row">{(game.tags || []).map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
          <div className="panel" style={{ marginTop: 16, background: "rgba(255,255,255,0.03)" }}>
            <div className="meta">Mô tả</div>
            <div className="feed-content">{game.description}</div>
          </div>
        </aside>
      </div>
    </section>
  );
};
