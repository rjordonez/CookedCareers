import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">C</span>
            </div>
            <span className="text-xl font-bold">CSLibrary</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-sm">
              Log in
            </Button>
            <Button size="sm" className="rounded-full text-sm font-medium">
              Join for free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
