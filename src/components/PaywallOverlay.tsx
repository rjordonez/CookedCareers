import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PaywallOverlayProps {
  onPayClick: () => void;
  isLoading?: boolean;
  price?: string;
}

export function PaywallOverlay({ onPayClick, isLoading = false, price = '$7.99' }: PaywallOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Paywall card */}
      <Card className="relative z-10 w-full max-w-sm mx-4 shadow-2xl pointer-events-auto">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Unlock Your Review</CardTitle>
          <CardDescription className="text-sm mt-2">
            Pay once to access your detailed feedback and annotations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold">{price}</span>
          </div>

          <Button
            onClick={onPayClick}
            disabled={isLoading}
            size="lg"
            className="w-full text-base h-12"
          >
            {isLoading ? 'Processing...' : `Pay ${price}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment via Stripe
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
