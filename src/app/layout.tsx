import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Metadata } from 'next';

const outfit = Outfit({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  icons:{
    icon: '/icon.png',
  },
  title: "AI Innovation Lab - Leading AI Development Center in the Region",
  description: "AI Innovation Lab is the region's biggest AI development center. We create cutting-edge AI solutions for digital health, business automation, and chatbots. Join our industry internship program.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
