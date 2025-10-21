import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { ClerkProvider } from "@clerk/clerk-react";
import { PostHogProvider } from "posthog-js/react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
  session_recording: {
    recordCrossOriginIframes: true,
  },
};

createRoot(document.getElementById("root")!).render(
  <PostHogProvider
    apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
    options={posthogOptions}
  >
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ClerkProvider>
  </PostHogProvider>
);
