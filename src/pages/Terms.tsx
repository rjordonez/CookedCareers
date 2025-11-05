import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 20th, 2025</p>
        </div>
        <div className="prose prose-lg max-w-none">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">1. Terms</h2>
            <p className="mb-3">
              By accessing the website at{" "}
              <a href="https://cookedcareer.com/" className="text-primary hover:underline">
                https://cookedcareer.com/
              </a>{" "}
              and all related subdomains, you agree to be bound by these Terms of Use, all applicable laws and regulations,
              and you agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms,
              you are prohibited from using or accessing this site. The materials contained on this website are protected by applicable copyright
              and trademark law.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
            <p className="mb-3">
              Permission is granted to temporarily use Cooked Career's website for personal, non-commercial, and transitory viewing only.
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Modify or copy the source materials.</li>
              <li>Attempt to decompile or reverse engineer any software contained on Cooked Career's website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p className="mb-3">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by Cooked Career at any time.
              Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials
              in your possession, whether in electronic or printed format.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">3. Disclaimer</h2>
            <p className="mb-3">
              The materials on Cooked Career's website are provided on an "as is" basis. Cooked Career makes no warranties, expressed or implied,
              and hereby disclaims and negates all other warranties, including without limitation implied warranties or conditions of merchantability,
              fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="mb-3">
              Further, Cooked Career does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use
              of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">4. Limitations</h2>
            <p className="mb-3">
              In no event shall Cooked Career or its suppliers be liable for any damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use or inability to use the materials on Cooked Career's website,
              even if Cooked Career or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            <p className="mb-3">
              Because some jurisdictions do not allow limitations on implied warranties or limitations of liability for consequential or incidental
              damages, these limitations may not apply to you.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">5. Accuracy of Materials</h2>
            <p className="mb-3">
              The materials appearing on Cooked Career's website could include technical, typographical, or photographic errors. Cooked Career
              does not warrant that any of the materials on its website are accurate, complete, or current. Cooked Career may make changes to the
              materials contained on its website at any time without notice. However, Cooked Career does not make any commitment to update the materials.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">6. Modifications</h2>
            <p className="mb-3">
              Cooked Career may revise these Terms of Use for its website at any time without notice. By using this website, you are agreeing to be
              bound by the then-current version of these Terms of Use.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">7. Refund Policy</h2>
            <p className="mb-3">
              All payments made to Cooked Career for subscription plans or premium services are non-refundable, except where required by law.
            </p>
            <p className="mb-3">
              If you request a refund and it is approved, please note that the refund amount will exclude any payment processing or transaction fees
              charged by Stripe or other payment providers.
            </p>
            <p className="mb-3">
              Refund requests must be made within 7 days of the original transaction by contacting{" "}
              <a href="mailto:cookedcareer@gmail.com" className="text-primary hover:underline">
                cookedcareer@gmail.com
              </a>
              . Refunds are not available for partially used subscription periods or promotional discounts.
            </p>
            <p className="mb-3">
              Cooked Career reserves the right to deny refund requests that do not meet these conditions.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">8. Governing Law</h2>
            <p className="mb-3">
              These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit
              to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">9. Contact Information</h2>
            <p className="mb-3">If you have any questions about these Terms of Use, please contact us at:</p>
            <p className="mb-2">Cooked Career Inc.</p>
            <p className="mb-2">
              Email:{" "}
              <a href="mailto:cookedcareer@gmail.com" className="text-primary hover:underline">
                cookedcareer@gmail.com
              </a>
            </p>
            <p className="mb-2">Website: www.cookedcareer.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
