import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientBody from "./ClientBody";
import Script from "next/script";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import { EnvScript } from '@daniel-rose/envex/script';
import { EnvexProvider } from '@daniel-rose/envex';
import { getPublicEnv } from '@daniel-rose/envex/server';
import TokenProvider from '../components/providers/TokenProvider';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auth web",
  // description: "Modern authentication UI with Material UI, Redux Toolkit and LINE LIFF integration",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialEnv = await getPublicEnv();
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <EnvScript />
        <EnvexProvider initialEnv={initialEnv}>
          <AppRouterCacheProvider>
            <NextIntlClientProvider>
              <ReduxProvider>
                <TokenProvider>
                  <ThemeProvider>
                    <ClientBody>{children}</ClientBody>
                  </ThemeProvider>
                </TokenProvider>
              </ReduxProvider>
            </NextIntlClientProvider>
          </AppRouterCacheProvider>
        </EnvexProvider>
      </body>
    </html>
  );
}
