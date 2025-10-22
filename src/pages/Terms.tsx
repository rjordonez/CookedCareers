const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-lg">
          <p className="text-muted-foreground mb-6">Last updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using CookedCareer, you accept and agree to be bound by the terms and provision
              of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
            <p className="mb-4">
              You agree to use our service only for lawful purposes and in accordance with these Terms.
              You agree not to use the service in any way that could damage, disable, overburden, or impair the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Subscription and Payment</h2>
            <p className="mb-4">
              Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring
              and periodic basis. Billing cycles are set on a monthly basis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="mb-4">
              The service and its original content, features, and functionality are and will remain the exclusive
              property of CookedCareer and its licensors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:jessie@nativespeaking.ai" className="text-primary hover:underline">
                jessie@nativespeaking.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
