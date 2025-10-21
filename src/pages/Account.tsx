import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSubscriptionStatusQuery, useCreatePortalSessionMutation } from "@/features/subscription/subscriptionService";
import { Loader2, CreditCard, Crown } from "lucide-react";
import { toast } from "sonner";

const Account = () => {
  const { user } = useUser();
  const { data: subscription, isLoading: isLoadingSubscription } = useGetSubscriptionStatusQuery();
  const [createPortalSession, { isLoading: isCreatingPortal }] = useCreatePortalSessionMutation();

  const handleManageSubscription = async () => {
    try {
      const { portal_url } = await createPortalSession().unwrap();
      window.location.href = portal_url;
    } catch (error) {
      toast.error("Failed to open subscription portal. Please try again.");
      console.error("Portal session error:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      past_due: "bg-yellow-100 text-yellow-800",
      trialing: "bg-blue-100 text-blue-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and subscription</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg">{user?.fullName || "Not set"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingSubscription ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Current Plan</label>
                      <div className="flex items-center gap-2 mt-1">
                        {subscription?.is_pro && <Crown className="h-5 w-5 text-yellow-500" />}
                        <p className="text-2xl font-bold capitalize">{subscription?.tier}</p>
                      </div>
                    </div>
                    {subscription?.status && getStatusBadge(subscription.status)}
                  </div>

                  {subscription?.end_date && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {subscription.status === 'canceled' ? 'Access Until' : 'Next Billing Date'}
                      </label>
                      <p className="text-lg">
                        {new Date(subscription.end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {subscription?.is_pro && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleManageSubscription}
                      disabled={isCreatingPortal}
                      className="w-full sm:w-auto"
                    >
                      {isCreatingPortal ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Manage Subscription"
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Update payment method, cancel subscription, or view billing history
                    </p>
                  </div>
                )}

                {!subscription?.is_pro && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Upgrade to Pro to unlock premium features and access exclusive content
                    </p>
                    <Button className="w-full sm:w-auto">
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
