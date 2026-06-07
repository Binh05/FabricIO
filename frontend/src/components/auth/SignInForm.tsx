import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function SignInForm() {
  const navigate = useNavigate()
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(formData.username, formData.password)
  };

  return (
    <div className="border-border grid w-full max-w-7xl grid-cols-1 overflow-hidden rounded-lg border bg-[#141418]/70 shadow-2xl backdrop-blur-md md:rounded-lg lg:grid-cols-[0.95fr_1.05fr]">
        {/* Form panel - LEFT */}
        <div className="order-2 flex items-center justify-center bg-linear-to-b from-white/2 to-white/1 px-4 py-5 sm:px-6 md:px-8 lg:order-1 lg:px-9">
          <div className="max-md border-border w-full rounded-3xl border bg-[#141414]/80 p-5 shadow-xl sm:p-6 md:p-8">
            <h2 className="mb-2 text-2xl font-extrabold md:text-3xl">
              Chào mừng trở lại
            </h2>

            <p className="text-muted mt-2 text-sm leading-6">
              Đăng nhập để tiếp tục hành trình, theo dõi game yêu thích và tham
              gia các cuộc thảo luận mới nhất.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-muted block text-sm font-medium">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange("username")}
                  className="border-border placeholder:text-muted/50 focus:border-primary w-full rounded-2xl border bg-black/20 px-4 py-3 text-sm text-white transition outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="text-muted block text-sm font-medium">
                  Mật khẩu
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange("password")}
                    className="border-border placeholder:text-muted/50 focus:border-primary w-full rounded-2xl border bg-black/20 px-4 py-3 pr-12 text-sm text-white transition outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted absolute top-1/2 right-4 -translate-y-1/2 text-sm"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 text-sm">
                <span className="text-primary hover:text-primary-glow cursor-pointer font-medium">
                  Quên mật khẩu?
                </span>
              </div>

              <Button
                variant="gradient"
                type="submit"
                className="shadow-primary/20 w-full rounded-2xl shadow-lg active:scale-95"
              >
                Đăng nhập
              </Button>
            </form>

            <div className="text-muted/50 my-5 flex items-center gap-3 text-xs tracking-[0.2em] uppercase">
              <div className="h-px flex-1 bg-white/10"></div>
              <span>hoặc tiếp tục</span>
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
              Chưa có tài khoản?{" "}
              <Link
                to="/signup"
                className="text-primary cursor-pointer font-bold"
              >
                Đăng ký
              </Link>
            </p>
          </div>
        </div>

        {/* Info panel - RIGHT */}
        <div className="border-border order-1 flex flex-col justify-center border-b bg-[radial-gradient(circle_at_top_right,rgba(255,95,65,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-5 py-8 sm:px-8 md:px-10 lg:order-2 lg:border-b-0 lg:border-l lg:px-12 lg:py-14">
          <span
            onClick={() => navigate("/")}
            className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 inline-block w-fit cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition"
          >
            Về FabricIO
          </span>

          <h1 className="mt-5 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Quay lại thế giới game và cộng đồng của bạn.
          </h1>

          <p className="text-muted mt-5 max-w-xl text-sm leading-7 sm:text-base">
            Truy cập hồ sơ, tiếp tục thảo luận, khám phá bản phát hành mới và
            kết nối với nhà sáng tạo cùng người chơi trên nền tảng.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "Theo dõi game yêu thích",
              "Lưu game vào danh sách",
              "Tham gia trò chuyện cùng người chơi",
              "Theo dõi nhà sáng tạo và cập nhật",
            ].map((item) => (
              <div
                key={item}
                className="border-border text-muted rounded-2xl border bg-white/5 px-4 py-4 text-sm"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="border-primary/20 bg-primary/5 mt-8 rounded-3xl border p-5">
            <p className="text-muted text-sm leading-7 italic">
              "Khám phá thế giới mới, chia sẻ suy nghĩ và lưu giữ dấu ấn chơi
              game của bạn trên một nền tảng gọn gàng."
            </p>
          </div>
        </div>
      </div>
  )
}
