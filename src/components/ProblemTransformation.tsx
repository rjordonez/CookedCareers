import { XCircle, CheckCircle } from "lucide-react";

const ProblemTransformation = () => {
  return (
    <section className="py-24 px-6 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center mb-16">
          Stop guessing. Start learning from success.
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Problem - Clickable */}
          <button className="p-8 rounded-xl bg-background hover:shadow-xl transition-all duration-300 text-left w-full group">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-8 w-8 text-destructive" />
              <h3 className="text-destructive">Without CSLibrary</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">Spending hours on generic resume templates that don't work</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">No clue what projects actually impress recruiters</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">Applying blindly with zero interviews</span>
              </li>
              <li className="flex gap-3">
                <span className="text-destructive mt-1">•</span>
                <span className="text-muted-foreground">Watching others land offers while you struggle</span>
              </li>
            </ul>
          </button>

          {/* Success - Clickable */}
          <button className="p-8 rounded-xl bg-accent/5 hover:bg-accent/10 hover:shadow-xl transition-all duration-300 text-left w-full group">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-accent" />
              <h3 className="text-accent">With CSLibrary</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground font-medium">See exactly what got students hired at FAANG</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground font-medium">Build projects that stand out to tech recruiters</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground font-medium">Land interviews at top companies</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground font-medium">Join a community of successful CS students</span>
              </li>
            </ul>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProblemTransformation;
