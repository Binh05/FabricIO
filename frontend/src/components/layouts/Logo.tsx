import { Link } from "react-router-dom";
import Fab_logo from "@/assets/Fab_logo.png";

const Logo = () => {
  return (
    <Link
      className="flex items-center gap-3 text-[22px] font-extrabold tracking-[-0.5px]"
      to="/"
    >
      <img src={Fab_logo} alt="web logo" className="size-14" />
      <span>FabricIO</span>
    </Link>
  );
};

export default Logo;
