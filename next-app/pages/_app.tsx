import '@fontsource/maple-mono';
import { Geist, Geist_Mono } from "next/font/google";
import '../styles/globals.css'
import Head from 'next/head'
import { AppProps } from "next/app";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "bobers",
  description: "Better webapp in the world.",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>

      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Component {...pageProps} />
      </div>
    </>
  )
}
