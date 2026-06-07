import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const GameReview = () => {
  const { draft, addGame, updateGame, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  if (!draft) {
    return (
      <section className="mb-16">
        <div className="bg-card border-border rounded-lg border p-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Chưa có dữ liệu xem trước</h2>
          <p className="text-muted mb-8">
            Hãy tạo hoặc chỉnh sửa game trước khi mở trang review.
          </p>
          <div className="flex justify-center">
            <Link
              className="from-primary to-primary-glow shadow-glow inline-flex cursor-pointer items-center justify-center rounded-sm border-none bg-linear-to-br px-6 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
              to="/submit-game"
            >
              Tạo game mới
            </Link>
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
      <section className="mb-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
              {editId ? "Edit Preview" : "Before Publish"}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {editId
                ? "Xem trước và chỉnh sửa game"
                : "Xem trước game trước khi đăng"}
            </h1>
            <p className="text-muted">
              Đây là cách người chơi sẽ nhìn thấy trang game của bạn.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              className="text-muted border-border inline-flex cursor-pointer items-center justify-center rounded-sm border bg-transparent px-5 py-2.5 font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
              to={`/submit-game${editId ? `?edit=${editId}` : ""}`}
            >
              Quay lại chỉnh sửa
            </Link>
            <button
              className="from-primary to-primary-glow shadow-glow inline-flex cursor-pointer items-center justify-center rounded-sm border-none bg-linear-to-br px-6 py-3 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
              onClick={handlePublish}
            >
              {editId ? "Lưu thay đổi" : "Đăng game"}
            </button>
          </div>
        </div>

        <div className="border-border relative h-[400px] overflow-hidden rounded-lg border">
          <img
            className="h-full w-full object-cover"
            src={draft.heroImage}
            alt={draft.title}
          />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 bg-linear-to-t from-black via-black/40 to-transparent p-8">
            <div className="bg-primary/10 text-primary border-primary/20 self-start rounded-full border px-3 py-1 text-[13px] font-bold tracking-wider uppercase">
              {draft.status || "preview"}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              {draft.title}
            </h1>
            <div className="text-white/80">
              by{" "}
              <span className="font-medium text-white">{draft.developer}</span>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-2xl font-extrabold ${draft.price === 0 ? "text-success" : "text-warning"}`}
              >
                {draft.price === 0 ? "Free" : `$${draft.price}`}
              </span>
              <div className="flex gap-2">
                {draft.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[13px] text-white backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-8">
            <div className="bg-card border-border rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-bold">Giới thiệu ngắn</h2>
              <p className="text-muted text-justify leading-7">
                {draft.description}
              </p>
            </div>
            <div className="bg-card border-border rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-bold">Mô tả chi tiết</h2>
              <p className="text-muted text-justify leading-7">
                {draft.longDescription}
              </p>
            </div>
            {draft.gallery?.length > 0 && (
              <div className="bg-card border-border rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-bold">Ảnh show game</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {draft.gallery.map((img, i) => (
                    <img
                      className="border-border aspect-video w-full rounded-lg border object-cover"
                      key={i}
                      src={img}
                      alt="screenshot"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="detail-sidebar">
            <div className="bg-card border-border flex flex-col gap-6 rounded-lg border p-6">
              <h2 className="text-xl font-bold">Thông tin phát hành</h2>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="border-border flex justify-between border-b pb-2">
                  <span className="text-muted">Nền tảng:</span>{" "}
                  <span className="font-bold">{draft.platform}</span>
                </li>
                <li className="border-border flex justify-between border-b pb-2">
                  <span className="text-muted">Giá:</span>{" "}
                  <span className="font-bold">
                    {draft.price === 0 ? "Free" : `$${draft.price}`}
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};
