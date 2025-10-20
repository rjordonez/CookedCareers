import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
            <div className="relative bg-green-500/10 rounded-full p-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <h1 className="text-3xl font-bold">Welcome to Pro!</h1>
          </div>

          <p className="text-lg text-muted-foreground">
            Your subscription has been activated successfully
          </p>
        </div>

        <div className="bg-primary/5 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">What you get with Pro:</h2>
          <ul className="text-left space-y-2 max-w-md mx-auto">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Unlimited resume access</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Full contact information for all candidates</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Advanced search and filtering</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <span>Priority support</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            size="lg"
            className="w-full max-w-sm"
            onClick={() => navigate("/dashboard")}
          >
            Start Exploring Resumes
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard in 5 seconds...
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
