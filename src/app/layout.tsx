import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from 'react-hot-toast';
import AppLayout from "@/components/AppLayout";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seasons Greetings",
  description:
    "Web3 Seasons Greetings NFT Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </ThirdwebProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
