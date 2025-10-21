import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed left-1/2 top-6 z-50 flex h-[60px] w-[584px] -translate-x-1/2 items-center gap-6 rounded-full bg-[rgba(237,237,237,0.72)] px-6 py-2 backdrop-blur-xl">
      <div className="flex grow items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <span className="text-lg font-bold">CSLibrary</span>
        </Link>
      </div>

      <Link to="/pricing" className="text-sm font-semibold hover:opacity-80 transition-opacity">
        Pricing
      </Link>

      <Link to="/auth" className="text-sm font-semibold hover:opacity-80 transition-opacity">
        Log in
      </Link>

      <Link to="/auth" className="-me-3 min-w-fit">
        <Button size="sm" className="rounded-full text-sm font-semibold px-4 h-[44px] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
          Join for free
        </Button>
      </Link>
    </nav>
  );
};

export default Navigation;
