import Providers from "@/Providers";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "./globals.css";

const APP_DEFAULT_TITLE = "Spendiee - PWA App";
const APP_DESCRIPTION =
  "Spendiee is a Progressive Web App (PWA) designed to help you manage your expenses efficiently and effectively.";
const APP_NAME = "Spendiee";
const APP_TITLE_TEMPLATE = "%s | Spendiee - PWA App";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://http://192.168.1.105:3000";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL(defaultUrl),
  title: APP_DEFAULT_TITLE,
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased h-full flex flex-col`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <ToastContainer />
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
