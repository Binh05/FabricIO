import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,90,59,0.18),transparent_29%),radial-gradient(circle_at_top_right,rgba(255,90,59,0.12),transparent_22%),linear-gradient(180deg,#050505_0%,#0a0a0c_45%,#040404_100%)] px-4 py-6 md:px-6 flex items-center justify-center text-[#f5f7fa]">
      <Link
        to="/"
        className="group absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-border bg-black/30 px-4 py-2.5 text-sm font-semibold text-muted shadow-xl backdrop-blur-md transition hover:border-primary/30 hover:bg-primary/10 hover:text-white md:left-6 md:top-6"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 transition group-hover:bg-primary/20">
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        </span>
        <span>
          Về <span className="text-primary">FabricIO</span>
        </span>
      </Link>

      <div className="w-full max-w-7xl overflow-hidden rounded-lg md:rounded-lg border border-border bg-[#141418]/70 backdrop-blur-md shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        {/* Form is order-2 on mobile, order-1 on desktop -> places it on the LEFT on desktop */}
        <div className="order-2 lg:order-1 w-full px-4 py-5 sm:px-6 md:px-8 lg:px-9 flex items-center justify-center bg-linear-to-b from-white/2 to-white/1">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-[#141414]/80 p-5 sm:p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Đăng ký</h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Bắt đầu xây dựng hồ sơ và khám phá những game mới nhất.
            </p>

            {error && (
              <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mt-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm text-green-500">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2 text-left">
                  <label className="block text-sm font-medium text-muted">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={formData.username}
                    onChange={handleChange("username")}
                    disabled={loading}
                    className="w-full rounded-2xl border border-border bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted/50 focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-2 text-left">
                  <label className="block text-sm font-medium text-muted">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    placeholder="Tên hiển thị"
                    value={formData.displayName}
                    onChange={handleChange("displayName")}
                    disabled={loading}
                    className="w-full rounded-2xl border border-border bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="block text-sm font-medium text-muted">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  disabled={loading}
                  className="w-full rounded-2xl border border-border bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted/50 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2 text-left">
                  <label className="block text-sm font-medium text-muted">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange("password")}
                    disabled={loading}
                    className="w-full rounded-2xl border border-border bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted/50 focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-2 text-left">
                  <label className="block text-sm font-medium text-muted">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Xác nhận"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    disabled={loading}
                    className="w-full rounded-2xl border border-border bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted/50 focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-linear-to-br from-primary to-primary-glow text-white font-bold py-3 px-6 shadow-lg shadow-primary/20 hover:brightness-110 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted/50">
              <div className="h-px flex-1 bg-white/10"></div>
              <span>HOẶC TIẾP TỤC</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <button type="button" className="w-full rounded-2xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Tiếp tục với Google
            </button>

            <p className="mt-5 text-center text-sm text-muted">
              Đã có tài khoản?{" "}
              <Link
                to="/signin"
                className="font-bold text-primary cursor-pointer"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* Info is order-1 on mobile, order-2 on desktop -> places it on the RIGHT on desktop, and on TOP on mobile */}
        <div className="order-1 lg:order-2 w-full border-b lg:border-b-0 lg:border-l border-border px-5 py-8 sm:px-8 md:px-10 lg:px-12 lg:py-14 bg-[radial-gradient(circle_at_top_right,rgba(255,95,65,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] flex flex-col justify-center">
          <span className="inline-block w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Tham gia cộng đồng FabricIO
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            Tạo tài khoản người chơi và bước vào cộng đồng.
          </h1>

          <p className="mt-5 max-w-xl text-sm sm:text-base leading-7 text-muted">
            Khám phá game indie, theo dõi nhà sáng tạo, tương tác với bài viết cộng đồng và đăng nội dung game của riêng bạn.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Khám phá game mới",
              "Theo dõi nhà sáng tạo",
              "Tham gia thảo luận cộng đồng",
              "Đăng bài viết của bạn",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-white/5 px-4 py-2 text-sm text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
