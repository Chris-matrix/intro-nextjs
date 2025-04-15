import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import SessionProvider from '../components/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadata for the application
export const metadata = {
    title: 'Book Inventory Manager',
    description: 'A modern book inventory management system built with Next.js',
};

<<<<<<< HEAD
// Root Layout Component
// This wraps around all pages in the application
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply font variables to the entire application */}
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        {children}  {/* This is where page content will be rendered */}
      </body>
    </html>
  );
=======
// Root layout component with authentication provider
export default async function RootLayout({ children }) {
    const session = await getServerSession();

    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider session={session}>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
<<<<<<< HEAD
>>>>>>> 3a285dee90da412a71326a90439d625170d3023d
=======
>>>>>>> 9ee14ad4717d79f3440f7d641b613ce6c77e1848
>>>>>>> eb6e63ca551e556c552ea5db59ac8c030a68aea7
}
