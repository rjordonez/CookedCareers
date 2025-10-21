import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Navigation = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed left-1/2 top-4 md:top-6 z-50 flex h-[60px] w-[90%] max-w-[584px] -translate-x-1/2 items-center gap-3 md:gap-6 rounded-full bg-[rgba(237,237,237,0.72)] px-4 md:px-6 py-2 backdrop-blur-xl">
      <div className="flex grow items-center min-w-0">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <span className="text-base md:text-lg font-bold truncate" style={{ letterSpacing: '-0.05em' }}>CookedCareer</span>
        </Link>
      </div>

      {isSignedIn ? (
        <Link to="/dashboard" className="-me-3 min-w-fit shrink-0">
          <Button size="sm" className="rounded-full text-sm font-semibold px-3 md:px-4 h-[44px] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
            Dashboard
          </Button>
        </Link>
      ) : (
        <>
          <Link to="/auth" className="hidden sm:block text-sm font-semibold hover:opacity-80 transition-opacity shrink-0">
            Log in
          </Link>

          <Link to="/auth" className="-me-3 min-w-fit shrink-0">
            <Button size="sm" className="rounded-full text-xs md:text-sm font-semibold px-3 md:px-4 h-[44px] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
              Join for free
            </Button>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;
