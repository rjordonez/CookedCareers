import { XCircle, CheckCircle } from "lucide-react";

const ProblemTransformation = () => {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Stop guessing. Start learning from success.
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem */}
          <div className="p-8 rounded-2xl border-2 border-destructive/20 bg-background">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-8 w-8 text-destructive" />
              <h3 className="text-2xl font-bold">Without CSLibrary</h3>
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
          </div>

          {/* Success */}
          <div className="p-8 rounded-2xl border-2 border-accent bg-accent/5">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-accent" />
              <h3 className="text-2xl font-bold">With CSLibrary</h3>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemTransformation;
