import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Digital Dark Spot — Information Gap Detection', description: 'Find what the internet doesn’t tell you.' };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" data-theme="dark"><body>{children}</body></html>);
}
