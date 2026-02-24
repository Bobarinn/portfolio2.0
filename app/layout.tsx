import type { Metadata } from "next";
import Script from "next/script";
import ConsentBanner from "@/components/ConsentBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victor Kolade Abobarin – Product Manager",
  description: "Product manager building AI products that work. Technical depth in LLM-powered workflows and enterprise SaaS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Google Consent Mode v2 - Must load before Google Analytics */}
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Set default consent to 'denied' for GDPR compliance
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WW954STCDE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WW954STCDE');
          `}
        </Script>

        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
