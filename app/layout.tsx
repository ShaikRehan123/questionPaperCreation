import { Toaster } from "@/components/ui/toaster";

import Sidebar from "@/components/Sidebar";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

type RootLayoutProps = {
  children: React.ReactNode;
};

import { Space_Grotesk } from "next/font/google";
import { Metadata } from "next";
import Providers from "@/lib/provider";

const SpaceGroteskFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Question Paper Generator",
  description: "Generate question papers for your students",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${SpaceGroteskFont.variable}`}
      >
        <head />
        <body className="font-SpaceGrotesk">
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="flex h-screen w-screen">
                <Sidebar />
                <div className="ml-0 md:ml-[300px] lg:ml-[400px] overflow-y-auto py-8 px-8 w-full">
                  {children}
                </div>
              </div>
              <Toaster />
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </>
  );
}
