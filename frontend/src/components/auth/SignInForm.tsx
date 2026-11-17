import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Lock, Mail } from "lucide-react";

export default function SignInForm() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    await login(formData.email, formData.password);
  };

  const onOAuth = () => {
    toast.info(
      "Chức năng đăng nhập bằng Google hiện đang được phát triển. Vui lòng sử dụng phương thức đăng nhập thông thường.",
    );
  };

  return (
    <div className="grid w-full max-w-7xl grid-cols-1 overflow-hidden lg:grid-cols-2">
      {/* Form panel - LEFT */}
      <div className="order-2 flex items-center justify-center px-4 py-5 sm:px-6 md:px-8 lg:order-1 lg:px-9">
        <div className="border-border bg-surface-container-lowest w-full max-w-lg rounded-md border p-5 shadow-xl sm:p-6 md:p-8">
          <h2 className="mb-2 text-2xl font-extrabold md:text-3xl">
            Chào mừng trở lại
          </h2>

          <p className="text-muted mt-2 text-sm leading-6">
            Đăng nhập để tiếp tục hành trình, theo dõi game yêu thích và tham
            gia các cuộc thảo luận mới nhất.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="signin-email"
                className="text-muted block text-sm font-medium"
              >
                Email
              </label>
              <InputGroup className="border-border bg-surface-container-low focus-within:border-primary h-11 rounded-sm">
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
                <InputGroupInput
                  id="signin-email"
                  type="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className="text-foreground placeholder:text-muted-foreground px-3 text-sm"
                />
              </InputGroup>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="signin-password"
                className="text-muted block text-sm font-medium"
              >
                Mật khẩu
              </label>

              <InputGroup className="border-border bg-surface-container-low focus-within:border-primary h-11 rounded-sm">
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupInput
                  id="signin-password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange("password")}
                  className="text-foreground placeholder:text-muted-foreground px-3 text-sm"
                />
              </InputGroup>
            </div>

            <Button
              variant="gradient"
              type="submit"
              className="shadow-primary/20 hover:bg-primary-glow/90 text-foreground w-full rounded-sm py-4 font-semibold shadow-lg active:scale-95"
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
            className="w-full rounded-sm py-4 font-semibold"
            onClick={onOAuth}
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
      <div className="border-border order-1 hidden flex-col justify-center rounded-md border-b bg-[radial-gradient(circle_at_top_right,rgba(255,95,65,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-5 py-8 sm:px-8 md:flex md:px-10 lg:order-2 lg:border-b-0 lg:border-l lg:px-12 lg:py-14">
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Quay lại thế giới game và cộng đồng của bạn.
        </h1>

        <p className="text-muted mt-5 max-w-xl text-sm leading-7 sm:text-base">
          Truy cập hồ sơ, tiếp tục thảo luận, khám phá bản phát hành mới và kết
          nối với nhà sáng tạo cùng người chơi trên nền tảng.
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
              className="border-border text-muted rounded-sm border bg-white/5 px-4 py-4 text-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="border-primary/20 bg-primary/5 mt-8 rounded-md border p-5">
          <p className="text-muted text-sm leading-7 italic">
            "Khám phá thế giới mới, chia sẻ suy nghĩ và lưu giữ dấu ấn chơi game
            của bạn trên một nền tảng gọn gàng."
          </p>
        </div>
      </div>
    </div>
  );
}
