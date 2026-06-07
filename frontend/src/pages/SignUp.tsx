import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,90,59,0.18),transparent_29%),radial-gradient(circle_at_top_right,rgba(255,90,59,0.12),transparent_22%),linear-gradient(180deg,#050505_0%,#0a0a0c_45%,#040404_100%)] px-4 py-6 text-[#f5f7fa] md:px-6">
      <Link
        to="/"
        className="group border-border text-muted hover:border-primary/30 hover:bg-primary/10 absolute top-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border bg-black/30 px-4 py-2.5 text-sm font-semibold shadow-xl backdrop-blur-md transition hover:text-white md:top-6 md:left-6"
      >
        <span className="group-hover:bg-primary/20 flex h-7 w-7 items-center justify-center rounded-full bg-white/5 transition">
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        </span>
        <span>
          Về <span className="text-primary">FabricIO</span>
        </span>
      </Link>

      <div className="border-border grid w-full max-w-7xl grid-cols-1 overflow-hidden rounded-lg border bg-[#141418]/70 shadow-2xl backdrop-blur-md md:rounded-lg lg:grid-cols-2">
        {/* Form is order-2 on mobile, order-1 on desktop -> places it on the LEFT on desktop */}
        <div className="order-2 flex w-full items-center justify-center bg-linear-to-b from-white/2 to-white/1 px-4 py-5 sm:px-6 md:px-8 lg:order-1 lg:px-9">
          <div className="border-border w-full max-w-lg rounded-3xl border bg-[#141414]/80 p-5 shadow-xl sm:p-6 md:p-8">
            <h2 className="mb-2 text-2xl font-extrabold md:text-3xl">
              Đăng ký
            </h2>

            <p className="text-muted mt-2 text-sm leading-6">
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
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-muted block text-sm font-medium">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={formData.username}
                    onChange={handleChange("username")}
                    disabled={loading}
                    className="border-border placeholder:text-muted/50 focus:border-primary w-full rounded-2xl border bg-black/20 px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2 text-left">
                  <label className="text-muted block text-sm font-medium">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    placeholder="Tên hiển thị"
                    value={formData.displayName}
                    onChange={handleChange("displayName")}
                    disabled={loading}
                    className="border-border placeholder:text-muted/50 focus:border-primary w-full rounded-2xl border bg-black/20 px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="text-muted block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  disabled={loading}
                  className="border-border placeholder:text-muted/50 focus:border-primary w-full rounded-2xl border bg-black/20 px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-muted block text-sm font-medium">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange("password")}
                    disabled={loading}
                    className="border-border placeholder:text-muted/50 focus:border-primary w-full rounded-2xl border bg-black/20 px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2 text-left">
                  <label className="text-muted block text-sm font-medium">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Xác nhận"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    disabled={loading}
                    className="border-border placeholder:text-muted/50 focus:border-primary w-full rounded-2xl border bg-black/20 px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <Button
                variant="gradient"
                type="submit"
                disabled={loading}
                className="shadow-primary/20 w-full rounded-2xl shadow-lg active:scale-95"
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>
            </form>

            <div className="text-muted/50 my-5 flex items-center gap-3 text-xs tracking-[0.2em] uppercase">
              <div className="h-px flex-1 bg-white/10"></div>
              <span>HOẶC TIẾP TỤC</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full rounded-2xl"
            >
              Tiếp tục với Google
            </Button>

            <p className="text-muted mt-5 text-center text-sm">
              Đã có tài khoản?{" "}
              <Link
                to="/signin"
                className="text-primary cursor-pointer font-bold"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* Info is order-1 on mobile, order-2 on desktop -> places it on the RIGHT on desktop, and on TOP on mobile */}
        <div className="border-border order-1 flex w-full flex-col justify-center border-b bg-[radial-gradient(circle_at_top_right,rgba(255,95,65,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-5 py-8 sm:px-8 md:px-10 lg:order-2 lg:border-b-0 lg:border-l lg:px-12 lg:py-14">
          <span className="border-primary/20 bg-primary/10 text-primary inline-block w-fit rounded-full border px-4 py-2 text-sm font-semibold">
            Tham gia cộng đồng FabricIO
          </span>

          <h1 className="mt-5 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Tạo tài khoản người chơi và bước vào cộng đồng.
          </h1>

          <p className="text-muted mt-5 max-w-xl text-sm leading-7 sm:text-base">
            Khám phá game indie, theo dõi nhà sáng tạo, tương tác với bài viết
            cộng đồng và đăng nội dung game của riêng bạn.
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
                className="border-border text-muted rounded-full border bg-white/5 px-4 py-2 text-sm"
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
