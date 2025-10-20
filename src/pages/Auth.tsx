import { SignIn } from "@clerk/clerk-react";

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-lg',
          }
        }}
        forceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
    </div>
  );
};

export default Auth;
