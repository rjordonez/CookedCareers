import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSubscriptionStatusQuery, useCreatePortalSessionMutation } from "@/features/subscription/subscriptionService";
import { Loader2, CreditCard, Crown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { data: subscription, isLoading: isLoadingSubscription } = useGetSubscriptionStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createPortalSession, { isLoading: isCreatingPortal }] = useCreatePortalSessionMutation();

  const handleManageSubscription = async () => {
    try {
      const { portal_url } = await createPortalSession().unwrap();
      window.location.href = portal_url;
    } catch (error) {
      console.error("Portal session error:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

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
                        {subscription?.is_trialing ? "Trial Ends" : "Subscription Ends"}
                      </label>
                      <p className="text-lg">
                        {new Date(subscription.end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {subscription?.is_trialing && (
                        <p className="text-sm text-muted-foreground mt-1">
                          You won't be charged until the trial ends
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Manage Subscription: Show for pro tier OR free/trialing */}
                {(subscription?.tier === 'pro' ||
                  (subscription?.tier === 'free' && subscription?.status === 'trialing')) && (
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
                      ) : subscription?.tier === 'pro' && subscription?.status === 'canceled' ? (
                        "Resubscribe"
                      ) : subscription?.tier === 'free' && subscription?.status === 'trialing' ? (
                        "Manage Trial"
                      ) : (
                        "Manage Subscription"
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      {subscription?.tier === 'pro' && subscription?.status === 'canceled'
                        ? "Reactivate your subscription to regain access to premium features"
                        : subscription?.tier === 'free' && subscription?.status === 'trialing'
                        ? "Cancel your trial or update payment method"
                        : "Update payment method, cancel subscription, or view billing history"}
                    </p>
                  </div>
                )}

                {/* Start Trial: Only show for free/active (never attempted) */}
                {subscription?.tier === 'free' && subscription?.status === 'active' && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Start your 3-day free trial to unlock premium features and access exclusive content
                    </p>
                    <Button className="w-full sm:w-auto">
                      Start 3-Day Free Trial
                    </Button>
                  </div>
                )}

                {/* Trial Canceled: Show message for free/canceled */}
                {subscription?.tier === 'free' && subscription?.status === 'canceled' && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Your trial has ended. Start a new subscription to unlock premium features and access exclusive content
                    </p>
                    <Button className="w-full sm:w-auto">
                      Subscribe to Pro
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
