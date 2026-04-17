import type { Metadata } from "next";
import { Lustria, Lato } from "next/font/google";
import "./globals.css";

const lustria = Lustria({
  weight: "400",
  variable: "--font-lustria",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Good Garbage Podcast",
  description: "Sustainable ideas for a messy world.",
};

import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lustria.variable} ${lato.variable}`}>
      <body className="antialiased font-sans">
        <div className="grain-overlay" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}



