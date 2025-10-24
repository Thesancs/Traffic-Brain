import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Sora } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], display: 'swap', variable: '--font-sora' });

export const metadata: Metadata = {
  title: 'Traffic Brain Dashboard',
  description: 'SaaS platform for centralizing paid traffic data',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${sora.variable}`}>
      <body className="font-body antialiased bg-background text-foreground">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-aurora opacity-80" />
          <div className="aurora-spot left-[-10%] top-[20%] h-[28rem] w-[28rem] bg-primary/40 animate-pulse-soft" />
          <div className="aurora-spot right-[-12%] top-[-10%] h-[26rem] w-[26rem] bg-accent/40 animate-pulse-soft delay-300" />
          <div className="aurora-spot left-1/2 bottom-[-20%] h-[30rem] w-[30rem] -translate-x-1/2 bg-chart-3/30 animate-pulse-soft delay-700" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
