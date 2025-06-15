import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar/nav';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pick&Partner – Newsletter Marketing Insights & Strategies',
  description: 'Unlock the power of newsletter marketing with Pick&Partner. Discover expert insights, practical tutorials, and effective strategies to grow your audience and boost engagement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
          </div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>

      </body>
    </html>
  );
}