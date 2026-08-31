import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";

export const metadata = {
  title: "Privacy Policy — ValoVault",
  description: "Learn how ValoVault collects, uses, and protects your information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">
                LEGAL // COMPLIANCE
              </span>
            </div>
            <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
              PRIVACY POLICY
            </h1>
            <p className="mt-2 font-mono text-xs text-muted">
              LAST UPDATE: AUGUST 2026 // VERSION 1.0
            </p>
          </Container>
        </div>

        {/* Content */}
        <Container className="py-16">
          <div className="mx-auto max-w-3xl space-y-10 font-sans text-sm leading-relaxed text-muted">
            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                1. Overview
              </h2>
              <p>
                Welcome to ValoVault. We value your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, and share information when you access or sign in to our tactical encyclopedia and companion web services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                2. Information We Collect
              </h2>
              <p>
                When using ValoVault, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Account Information:</strong> If you sign in via third-party authentication services (such as Discord), we collect your unique account identifier, display name, public profile avatar URL, and email address as provided by the identity provider.
                </li>
                <li>
                  <strong className="text-white">Usage Data:</strong> We collect details of your visits to our website, including traffic logs, navigation flows, search queries, and your collection/wishlist selections.
                </li>
                <li>
                  <strong className="text-white">Device Information:</strong> We collect technical parameters such as IP address, browser type, operating system, and hardware status (WebGL acceleration) to optimize the user interface.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                3. How We Use Information
              </h2>
              <p>
                We process your data for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To customize your database deck and sync your wishlist items across devices.</li>
                <li>To power the Skins Collection Tracker and display completion rates.</li>
                <li>To analyze website usage, debug performance, and monitor system stability.</li>
                <li>To serve relevant advertisements and track ad impressions.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                4. Cookies, AdSense &amp; Third-Party Advertising
              </h2>
              <p>
                We use cookies, local storage, and caching mechanisms to verify your sessions, recall preferences, and analyze navigation telemetry.
              </p>
              <p>
                We partner with Google AdSense and other advertising networks to serve advertisements when you visit our website. These third-party vendors use cookies to serve ads based on your prior visits to ValoVault or other websites on the Internet:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.
                </li>
                <li>
                  Google, as a third-party vendor, uses cookies (including the DoubleClick cookie) to serve ads in our application environment.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#0DF2F2] hover:underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting the <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#0DF2F2] hover:underline">About Ads Portal</a>.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                5. Data Retention &amp; Deletion
              </h2>
              <p>
                We retain your account data (such as wishlists and profile details) for as long as your account is active. If you wish to delete your account data and remove your credentials from our database, you can do so at any time by visiting your profile settings dashboard or by contacting us directly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                6. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy or data deletion requests, please contact us at:
              </p>
              <p className="font-mono text-xs bg-[rgba(15,28,36,0.6)] border border-[rgba(236,232,225,0.08)] p-3 inline-block text-white">
                godrikt1408@gmail.com
              </p>
            </section>

            <div className="border-t border-[rgba(236,232,225,0.08)] pt-6 text-center text-xs font-mono text-muted">
              RIOT GAMES DISCLAIMER: ValoVault is an independent fan database utilizing official community assets and is not endorsed by or affiliated with Riot Games.
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
