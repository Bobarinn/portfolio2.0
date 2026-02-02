import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
