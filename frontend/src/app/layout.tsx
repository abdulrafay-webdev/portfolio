import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abdul Rafay - Full Stack Developer",
  description: "Premium futuristic developer portfolio showcasing projects and services",
  keywords: ["developer", "portfolio", "full-stack", "Next.js", "FastAPI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
