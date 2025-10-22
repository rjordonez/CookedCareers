// Subscription API Types

export type SubscriptionTier = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  is_pro: boolean;
  end_date?: string;
  user_resume_url?: string | null;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface PortalSessionResponse {
  portal_url: string;
}
