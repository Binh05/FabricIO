import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const SubmitGame = () => {
  const { games, draft, setDraft, showToast } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const editingGame = editId
    ? games.find((g) => g.id === Number(editId))
    : null;

  const [formData, setFormData] = useState({
    title: "",
    ownerName: user.username,
    platform: "windows",
    price: 0,
    description: "",
    longDescription: "",
    video: "",
    tags: [],
    customTags: "",
    ...editingGame,
    ...(editId ? {} : draft),
  });

  const [fileNotes, setFileNotes] = useState({
    build: "Chưa chọn file game.",
    cover: "Chưa chọn ảnh đại diện.",
    gallery: "Chưa chọn ảnh show game.",
  });

  const ALL_TAGS = [...new Set(games.flatMap((game) => game.tags))];

  useEffect(() => {
    if (editingGame) {
      setFormData((prev) => ({ ...prev, ...editingGame }));
    }
  }, [editingGame]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "tags") {
      setFormData((prev) => ({
        ...prev,
        tags: checked
          ? [...prev.tags, value]
          : prev.tags.filter((t) => t !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, key) => {
    const files = e.target.files;
    const note =
      files.length === 1 ? files[0].name : `${files.length} files selected`;
    setFileNotes((prev) => ({ ...prev, [key]: note }));

    // In a real app we'd upload these. For mock, we'll use object URLs or just notes.
    if (files.length > 0) {
      if (key === "cover") {
        setFormData((prev) => ({
          ...prev,
          heroImage: URL.createObjectURL(files[0]),
        }));
      }
      if (key === "gallery") {
        setFormData((prev) => ({
          ...prev,
          gallery: Array.from(files).map((f: Blob | MediaSource) =>
            URL.createObjectURL(f),
          ),
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const youtubeEmbedUrl = (input) => {
      if (!input) return "";
      try {
        const url = new URL(input);
        if (url.hostname.includes("youtu.be"))
          return `https://www.youtube.com/embed/${url.pathname.replace("/", "")}`;
        if (url.hostname.includes("youtube.com"))
          return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
      } catch (e) {}
      return input;
    };

    const finalTags = [
      ...new Set([
        ...formData.tags,
        ...(formData.customTags
          ? formData.customTags.split(",").map((t) => t.trim())
          : []),
      ]),
    ];

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
      rating: editingGame?.rating || 0,
    };

    setDraft(payload);
    showToast("Đã cập nhật trang xem trước");
    navigate(`/game-review${editId ? `?edit=${editId}` : ""}`);
  };

  return (
    <section className="mb-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-primary mb-2 block text-[13px] font-bold tracking-[2px] uppercase">
            Creator Upload
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {editingGame ? "Chỉnh sửa game" : "Đăng game mới lên cửa hàng"}
          </h1>
          <p className="text-muted">
            Tải build cho Windows, Android hoặc WebGL, thêm ảnh đại diện, ảnh
            show game, video YouTube, tag và giá bán.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-10 lg:flex-row">
        <form
          className="bg-card border-border flex-1 rounded-lg border p-6"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold">Tên game</label>
              <input
                className="border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold">
                Studio / Nhà phát triển
              </label>
              <input
                className="border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                name="developer"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold">Loại build</label>
              <select
                className="border-border focus:border-primary w-full rounded-xl border bg-black/20 p-3 text-white outline-none"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="windows">Windows (.zip)</option>
                <option value="android">Android (.apk)</option>
                <option value="webgl">WebGL (.zip)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold">
                Giá game (USD)
              </label>
              <input
                className="border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block text-sm font-semibold">Mô tả ngắn</label>
              <textarea
                className="border-border focus:border-primary min-h-30 w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block text-sm font-semibold">
                Mô tả chi tiết
              </label>
              <textarea
                className="border-border focus:border-primary min-h-30 w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block text-sm font-semibold">File game</label>
              <div className="border-border relative rounded-xl border-2 border-dashed p-6 text-center">
                <input
                  className="border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                  type="file"
                  onChange={(e) => handleFileChange(e, "build")}
                />
                <div className="text-muted mt-2 text-[12px]">
                  {fileNotes.build}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold">
                Ảnh đại diện game
              </label>
              <div className="border-border relative rounded-xl border-2 border-dashed p-6 text-center">
                <input
                  className="border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                  type="file"
                  onChange={(e) => handleFileChange(e, "cover")}
                />
                <div className="text-muted mt-2 text-[12px]">
                  {fileNotes.cover}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold">
                Ảnh show game
              </label>
              <div className="border-border relative rounded-xl border-2 border-dashed p-6 text-center">
                <input
                  className="border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e, "gallery")}
                />
                <div className="text-muted mt-2 text-[12px]">
                  {fileNotes.gallery}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block text-sm font-semibold">
                Link YouTube
              </label>
              <input
                className="border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                name="video"
                value={formData.video}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="block text-sm font-semibold">Tag game</label>
              <div className="mb-3 flex flex-wrap gap-2.5">
                {ALL_TAGS.map((tag: string) => (
                  <label
                    key={tag}
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag}
                      checked={formData.tags.includes(tag)}
                      onChange={handleChange}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
              <input
                className="border-border focus:border-primary w-full rounded-xl border bg-black/20 px-4 py-3 text-white outline-none"
                name="customTags"
                placeholder="Tag tùy chọn..."
                value={formData.customTags}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <Button variant="gradient" type="submit">
              {editingGame ? "Cập nhật xem trước" : "Xem trước game"}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/games">Quay lại thư viện</Link>
            </Button>
          </div>
        </form>
        <aside className="bg-card border-border sticky top-30 h-fit w-full rounded-lg border p-6 lg:w-[320px]">
          <h2 className="mb-4 text-xl font-bold">Preview Status</h2>
          <ul className="text-muted flex flex-col gap-2 text-sm">
            <li>
              Nền tảng:{" "}
              <span className="font-medium text-white">
                {formData.platform}
              </span>
            </li>
            <li>
              Giá:{" "}
              <span className="font-medium text-white">
                {formData.price === 0 ? "Free" : `$${formData.price}`}
              </span>
            </li>
            <li>
              Tags:{" "}
              <span className="font-medium text-white">
                {formData.tags.join(", ") || "None"}
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
};
