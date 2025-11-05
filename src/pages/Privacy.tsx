import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 20th, 2025</p>
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="mb-4">
            Your privacy is important to us. At Cooked Career, we believe in a few fundamental principles:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>We are thoughtful about the personal information we ask you to provide and the information we collect through our platform.</li>
            <li>We store personal information only as long as we have a legitimate reason to keep it.</li>
            <li>We aim to make it simple for you to control your personal data, including viewing, editing, or permanently deleting it.</li>
            <li>We strive for full transparency in how we gather, use, and share your personal information.</li>
          </ul>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Who We Are and What This Policy Covers</h2>
            <p className="mb-3">This Privacy Policy applies to information that we collect about you when you use:</p>
            <p className="mb-3">CookedCareer.com, our subdomains, and related web applications.</p>
            <p className="mb-3">
              Throughout this policy, when we say "Cooked Career," "we," "our," or "us," we're referring to Cooked Career Inc.,
              a U.S.-based company that provides resume-building, resume review, and ATS optimization tools for job seekers.
            </p>
            <p className="mb-3">This policy explains what information we collect, how we use it, and your choices regarding that information.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Deleting Your Data</h2>
            <p className="mb-3">
              You can request to delete your data at any time by emailing us at{" "}
              <a href="mailto:cookedcareer@gmail.com" className="text-primary hover:underline">
                cookedcareer@gmail.com
              </a>
              . Once verified, your personal data and account will be permanently deleted from our systems.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <p className="mb-3">
              We collect information about you only if we have a reason to do so, for example, to provide our services,
              communicate with you, or improve our platform.
            </p>
            <p className="mb-3">We collect information in three main ways:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Information you provide directly</li>
              <li>Information collected automatically</li>
              <li>Information obtained from public or third-party sources</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">1. Information You Provide to Us</h3>
            <p className="mb-3"><strong>Account Information:</strong> When you sign up for a Cooked Career account, we require an email address.
            You may also choose to provide your name, profile photo, or other details, but those are optional.</p>
            <p className="mb-3"><strong>Resume and Content Data:</strong> If you build or upload a resume or use our ATS scanner,
            we may collect and store that content, including personal details such as name, contact information, work history, and education.</p>
            <p className="mb-3"><strong>Communications:</strong> When you contact us via email, chat, or feedback forms,
            we may store your messages to help resolve issues or improve our services.</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">2. Information We Collect Automatically</h3>
            <p className="mb-3"><strong>Usage Data:</strong> We collect data about your interactions with our services,
            such as login times, features used, actions taken (for example, uploading a resume or editing content), and analytics related to user engagement.</p>
            <p className="mb-3"><strong>Device Information:</strong> We automatically collect information about your device,
            such as device type, operating system, browser type, screen size, and IP address.</p>
            <p className="mb-3"><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and similar tools to recognize your device,
            analyze site usage, and improve functionality. You can control or disable cookies through your browser settings, though some features may not work properly without them.</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">3. Information from Other Sources</h3>
            <p className="mb-3">
              If you choose to sign up or log in through third-party accounts (for example, Google or LinkedIn),
              we may receive information from that service, such as your name, profile image, and email address, in accordance with their authorization procedures.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">How and Why We Use Information</h2>
            <p className="mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>To provide and improve our services, for example, to build your resume, analyze it for ATS compatibility, and store your data securely.</li>
              <li>To develop new features that help job seekers improve their job applications.</li>
              <li>To communicate with you, including sending updates, product notifications, or responding to your support requests.</li>
              <li>To analyze trends and understand how users interact with our platform so we can make better design and usability decisions.</li>
              <li>To protect our users and platform from abuse, fraud, and unauthorized access.</li>
              <li>To comply with legal requirements or enforce our Terms of Service.</li>
              <li>To personalize your experience, such as offering recommendations or tips based on your resume content or job goals.</li>
            </ul>
            <p className="mb-3"><strong>We do not sell your personal information.</strong></p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Sharing Information</h2>
            <p className="mb-3">We share information about you only when necessary and with proper safeguards:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>Employees and Contractors:</strong> We may share data with authorized team members who need it to perform their work and are bound by confidentiality obligations.</li>
              <li><strong>Third-Party Vendors:</strong> We use trusted vendors to support our operations (for example, payment processors like Stripe, analytics services like Google Analytics, email delivery platforms, and cloud hosting providers).</li>
              <li><strong>Legal Obligations:</strong> We may disclose data in response to lawful requests such as subpoenas or court orders.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of company assets, your information may be transferred to a successor organization, consistent with this Privacy Policy.</li>
              <li><strong>With Your Consent:</strong> We may share information with third parties if you explicitly consent (for example, connecting your resume to a potential employer or recruiter).</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Your Choices</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>Limit the Information You Provide:</strong> You can use parts of Cooked Career without an account. When logged in, you control what information you include in your resume or profile.</li>
              <li><strong>Opt Out of Communications:</strong> You can unsubscribe from marketing or promotional emails through the unsubscribe link in those messages or by updating your preferences.</li>
              <li><strong>Cookies:</strong> You may configure your browser to reject cookies. Note that some features may not function properly without them.</li>
              <li><strong>Close Your Account:</strong> You can delete your account and all related data anytime by emailing{" "}
              <a href="mailto:cookedcareer@gmail.com" className="text-primary hover:underline">
                cookedcareer@gmail.com
              </a></li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have certain rights regarding your personal data, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Accessing or requesting a copy of your personal data</li>
              <li>Requesting corrections or deletion of your data</li>
              <li>Objecting to processing or requesting data portability</li>
              <li>Withdrawing consent where applicable</li>
            </ul>
            <p className="mb-3">
              If you wish to exercise any of these rights, please contact us at{" "}
              <a href="mailto:cookedcareer@gmail.com" className="text-primary hover:underline">
                cookedcareer@gmail.com
              </a>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
            <p className="mb-3">
              We retain your personal information only as long as necessary to provide our services, comply with legal obligations,
              resolve disputes, or enforce agreements. When your data is no longer needed, it will be securely deleted.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="mb-3">
              We implement industry-standard security measures to protect your information from unauthorized access, alteration, or destruction.
              However, no internet-based service is completely secure, and we cannot guarantee absolute protection.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">International Data Transfers</h2>
            <p className="mb-3">
              Although Cooked Career is based in the United States, your information may be processed or stored on servers located in other countries.
              We take reasonable steps to ensure your information remains protected and in compliance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
            <p className="mb-3">
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from minors.
              If you believe a child has provided personal data, please contact us, and we will delete it.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="mb-3">
              We may update this Privacy Policy from time to time. If we make significant changes, we will notify you via email or through our platform.
              The updated policy will always be available at cookedcareer.com/privacy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">GDPR and CCPA Compliance</h2>
            <p className="mb-3">
              If you are located in the European Economic Area (EEA) or California, you have additional rights under applicable privacy laws:
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">For EEA Users (GDPR)</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>You have the right to access, rectify, delete, or restrict processing of your personal data.</li>
              <li>You may request data portability or withdraw consent at any time.</li>
              <li>You have the right to lodge a complaint with your local data protection authority if you believe your rights are violated.</li>
              <li>Our legal basis for processing your data includes your consent, contract performance, legal obligations, and legitimate business interests.</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">For California Residents (CCPA/CPRA)</h3>
            <p className="mb-3">Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), you have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Request disclosure of what personal information we collect, use, and share.</li>
              <li>Request deletion of your personal information.</li>
              <li>Opt out of the sale or sharing of your personal information (we do not sell your data).</li>
              <li>Request correction of inaccurate information.</li>
              <li>Appoint an authorized agent to make requests on your behalf.</li>
            </ul>
            <p className="mb-3">
              You can exercise these rights by contacting us at{" "}
              <a href="mailto:cookedcareer@gmail.com" className="text-primary hover:underline">
                cookedcareer@gmail.com
              </a>{" "}
              with "Privacy Request" in the subject line.
            </p>
            <p className="mb-3">We verify all requests before processing them to ensure your data remains protected.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="mb-3">If you have any questions about this Privacy Policy or how we handle your information, please contact us at:</p>
            <p className="mb-2">Cooked Career Inc.</p>
            <p className="mb-2">
              Email:{" "}
              <a href="mailto:cookedcareer@gmail.com" className="text-primary hover:underline">
                cookedcareer@gmail.com
              </a>
            </p>
            <p className="mb-2">Website: www.cookedcareer.com</p>
            <p className="mb-2">Location: San Jose, California, U.S.A</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
