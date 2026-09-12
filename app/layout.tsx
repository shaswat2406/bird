import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import BackgroundDesign from '@/components/BackgroundDesign';
import NexusAICopilot from '@/components/NexusAICopilot';

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
        {/* Dynamic Multi-Layer Background Graphic Architecture */}
        <BackgroundDesign />
        
        <Navbar />
        <main className="relative z-10">{children}</main>

        {/* Global Floating AI Copilot & Exam Quizzer */}
        <NexusAICopilot />
      </body>
    </html>
  );
}