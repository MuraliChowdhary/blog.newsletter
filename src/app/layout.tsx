import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar/nav';
import { Toaster } from 'sonner';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "NextDevs | Share Ideas, Discover Trends, and Join the Conversation",
  description:
    "NextDevs is a modern social platform for sharing ideas, exploring the latest news, and discovering trending discussions on technology, startups, culture, entertainment, and more.",
  keywords: [
    "NextDevs",
    "social platform",
    "community discussions",
    "trending topics",
    "latest news",
    "AI",
    "startups",
    "technology",
    "innovation",
    "entertainment",
    "culture",
    "digital trends",
    "user stories",
  ],
  verification: {
    google: "rlA59x1ed6IQBB54FH7DatTyyYzaVujxXPtJawunOLE",
  },
  openGraph: {
    title: "NextDevs | Share Ideas, Discover Trends, and Join the Conversation",
    description:
      "Join NextDevs – a community-driven platform for trending discussions, stories, and insights across technology, AI, startups, culture, and entertainment.",
    url: "https://blog.nextdevs.me",
    siteName: "NextDevs",
    images: [
      {
        url: "https://blog.nextdevs.me/images/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "NextDevs – Explore Ideas and Trending Discussions",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextDevs | Explore Ideas & Trending Discussions",
    description:
      "Discover fresh ideas and trending stories on NextDevs – a modern platform for sharing and exploring community posts about tech, culture, startups, and more.",
    images: ["https://blog.nextdevs.me/images/og-blog.jpg"],
    creator: "@NextDevsOfficial",
  },
  alternates: { 
    canonical: "https://blog.nextdevs.me/" 
  },
  metadataBase: new URL("https://blog.nextdevs.me"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="background-color" content="#000000" />

        <link rel="icon" href="/icons/nextdevs192.jpg" />
        <link rel="apple-touch-icon" href="/icons/nextdevs512.jpeg" />
      </head>

      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navbar />
            <Script
            async
            src="https://plausible.io/js/pa-02pFWloxqRWKKY0bkzOpU.js"
            strategy="afterInteractive"
          />

        <Script id="plausible-init" strategy="afterInteractive">
          {`
            window.plausible = window.plausible || function() {
              (plausible.q = plausible.q || []).push(arguments);
            };
            plausible.init = plausible.init || function(i) {
              plausible.o = i || {};
            };
            plausible.init();
          `}
        </Script>
            <main>{children}</main>
          </div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}