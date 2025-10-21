const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">C</span>
            </div>
            <span className="text-lg font-bold" style={{ letterSpacing: '-0.05em' }}>CookedResume</span>
          </div>



          <p className="text-sm text-muted-foreground">© 2025 CookedResume. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
