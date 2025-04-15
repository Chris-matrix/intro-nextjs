import { Geist, Geist_Mono } from "next/font/google";  // Import custom fonts
import "./globals.css";  // Import global styles

// Configure the Geist Sans font
// This is a modern sans-serif font optimized for digital interfaces
const geistSans = Geist({
  variable: "--font-geist-sans",  // CSS variable name
  subsets: ["latin"],  // Character set to load
});

// Configure the Geist Mono font
// This is a monospace variant, good for code or technical content
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the application
// This helps with SEO and browser display
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Root Layout Component
// This wraps around all pages in the application
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Apply font variables to the entire application */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}  {/* This is where page content will be rendered */}
      </body>
    </html>
  );
}
