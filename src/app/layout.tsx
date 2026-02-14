import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider, AuthHydration, ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sociality - Connect with the World",
  description: "A modern social media platform to share moments, connect with friends, and discover new content.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthHydration />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            {children}
            <Toaster 
              position="top-right" 
              offset="90px" 
              toastOptions={{
                style: {
                  maxWidth: '320px',
                  paddingRight: '24px'
                }
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
