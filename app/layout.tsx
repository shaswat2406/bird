import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'LPU StudyNexus — The Academic Protocol',
  description: 'Synchronized study stages and peer bounty marketplace for Lovely Professional University.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${jakarta.className} antialiased selection:bg-orange-500/30 selection:text-orange-300 relative transition-colors duration-300 min-h-screen`}>
        {/* Subtle Ambient Top Beam */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(249,115,22,0.14),transparent)] pointer-events-none -z-10" />
        
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}