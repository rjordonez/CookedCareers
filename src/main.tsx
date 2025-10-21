import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
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
);
