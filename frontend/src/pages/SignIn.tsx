import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SignInForm from "@/components/auth/SignInForm";

export const SignIn = () => {

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(255,90,59,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,90,59,0.12),transparent_22%),linear-gradient(180deg,#050505_0%,#0a0a0c_45%,#040404_100%)] px-4 py-6 text-[#f5f7fa] md:px-6">
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

      <SignInForm />
      
    </div>
  );
};
