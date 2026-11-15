import { Link } from "react-router-dom";
import Fab_logo from "@/assets/Fab_logo.png";

const Logo = () => {
  return (
    <Link
      aria-label="FabricIO home"
      className="flex shrink-0 items-center gap-2"
      to="/"
    >
      <img src={Fab_logo} alt="" className="size-10 rounded-md" />
      <span className="text-2xl font-extrabold tracking-[-0.03em]">
        Fabric<span className="text-primary">IO</span>
      </span>
    </Link>
  );
};

export default Logo;
