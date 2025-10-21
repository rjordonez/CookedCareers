import { Button } from "@/components/ui/button";
import { Crown, Loader2 } from "lucide-react";
import { useCreateCheckoutSessionMutation } from "@/features/subscription/subscriptionService";
import { useToast } from "@/hooks/use-toast";

interface UpgradeButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const UpgradeButton = ({ variant = "default", size = "default", className }: UpgradeButtonProps) => {
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      const result = await createCheckoutSession().unwrap();
      window.location.href = result.checkout_url;
    } catch (error: any) {
      console.error("Failed to create checkout session:", error);
      toast({
        title: "Error",
        description: error?.data?.detail || error?.error || "Failed to start upgrade process. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <Crown className="mr-2 h-4 w-4" />
          Get Pro
        </>
      )}
    </Button>
  );
};
