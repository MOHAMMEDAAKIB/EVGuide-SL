import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVGuide SL - Your Complete Sri Lankan EV Guide",
  description: "Discover, compare, and find the perfect electric vehicle for Sri Lanka. Real-world range estimates, TCO calculator, and charging station map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (!theme && prefersDark);
                
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                  document.body.style.backgroundColor = '#0a0a0a';
                  document.body.style.color = '#ededed';
                } else {
                  document.documentElement.style.colorScheme = 'light';
                  document.body.style.backgroundColor = '#ffffff';
                  document.body.style.color = '#171717';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Fixed Theme Toggle - Bottom Right on All Pages */}
        <div className="fixed bottom-6 right-6 z-9999">
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
