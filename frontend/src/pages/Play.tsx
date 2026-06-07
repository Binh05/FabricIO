import { useParams, Link, useSearchParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export const Play = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { games } = useApp();
  const game = games.find((g) => g.id === Number(id)) || games[0];

  const urlParam = searchParams.get("url");
  const webglUrl = urlParam || game.webglUrl || "";

  const formatCompact = (value) =>
    Intl.NumberFormat("en", { notation: "compact" }).format(value);

  const handleAction = (action) => {
    const frame = document.getElementById("webgl-iframe") as HTMLIFrameElement;
    if (!frame) return;
    if (action === "reload") {
      frame.src = frame.src;
    }
    if (action === "fullscreen") {
      frame.requestFullscreen?.();
    }
  };

  return (
    <section className="mb-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
            Play
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {game.title}
          </h1>
          <p className="text-muted">
            Trải nghiệm bản WebGL trực tiếp trong trình duyệt.
          </p>
        </div>
        <Link
          className="text-muted border-border inline-flex cursor-pointer items-center justify-center rounded-sm border bg-transparent px-5 py-2.5 font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
          to={`/game-detail/${game.id}`}
        >
          Game details
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_340px]">
        <div className="flex-1">
          {webglUrl ? (
            <>
              <div className="border-border relative aspect-video overflow-hidden rounded-lg border bg-black">
                <iframe
                  id="webgl-iframe"
                  className="h-full w-full border-none"
                  src={webglUrl}
                  title={`${game.title} WebGL`}
                  allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups"
                />
              </div>
              <div className="bg-card border-border mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
                <div className="flex gap-3">
                  <button
                    className="text-muted border-border cursor-pointer rounded-sm border bg-transparent px-5 py-2.5 font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                    onClick={() => handleAction("reload")}
                  >
                    Reload
                  </button>
                  <button
                    className="text-muted border-border cursor-pointer rounded-sm border bg-transparent px-5 py-2.5 font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                    onClick={() => handleAction("fullscreen")}
                  >
                    Fullscreen
                  </button>
                </div>
                <div className="text-muted text-[12px] italic">
                  Tip: WebGL chạy ổn nhất khi mở qua local server
                  (http://localhost), không phải file://
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card border-border rounded-lg border p-12 text-center">
              <h2 className="mb-4 text-2xl font-bold">
                Game này chưa có link WebGL để chơi
              </h2>
              <p className="text-muted mb-8">
                Bạn có thể mở trang này với tham số <code>?url=...</code> trỏ
                tới file <code>index.html</code> của build WebGL (đang được
                host).
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  className="from-primary to-primary-glow shadow-glow inline-flex cursor-pointer items-center justify-center rounded-sm border-none bg-linear-to-br px-6 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
                  to={`/submit-game?edit=${game.id}`}
                >
                  Thêm link WebGL
                </Link>
                <Link
                  className="text-muted border-border inline-flex cursor-pointer items-center justify-center rounded-sm border bg-transparent px-5 py-2.5 font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  to={`/game-detail/${game.id}`}
                >
                  Về trang game
                </Link>
              </div>
            </div>
          )}
        </div>
        <aside className="bg-card border-border sticky top-[120px] flex h-fit w-full flex-col gap-6 rounded-lg border p-6 lg:w-[340px]">
          <div className="bg-primary/10 text-primary border-primary/20 self-start rounded-full border px-3 py-1 text-[13px] font-bold tracking-wider uppercase">
            {game.status}
          </div>
          <h2 className="mt-2 text-2xl font-bold">Thông tin</h2>
          <div className="text-muted text-sm">
            by <span className="font-medium text-white">{game.developer}</span>
          </div>
          <div className="border-border flex items-center justify-between border-y py-2">
            <span
              className={`text-xl font-extrabold ${game.price === 0 ? "text-success" : "text-warning"}`}
            >
              {game.price === 0 ? "Free" : `$${game.price}`}
            </span>
            <div className="text-muted flex flex-col items-end text-[12px]">
              <span>{formatCompact(game.views)} views</span>
              <span>{formatCompact(game.downloads)} downloads</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(game.tags || []).map((tag) => (
              <span
                key={tag}
                className="text-muted border-border rounded-full border bg-white/5 px-3 py-1 text-sm text-[13px]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="border-border mt-4 rounded-xl border bg-white/3 p-4">
            <div className="text-muted mb-2 text-[12px] font-bold tracking-wider uppercase">
              Mô tả
            </div>
            <div className="text-muted text-sm leading-7">
              {game.description}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
