import '@fontsource/maple-mono';
// import { Geist, Geist_Mono, } from "next/font/google";
import '../styles/globals.css'
import Head from 'next/head'
import { AppProps } from "next/app";
import { Metadata } from 'next';
import { ReactNode } from 'react';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "bobers",
  description: "Better webapp in the world.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className={`antialiased`} >
          {children}
        </div>
      </body>
    </html>
  )
}
