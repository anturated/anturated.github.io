import { Geist, Geist_Mono } from "next/font/google";
import '../styles/globals.css'
import Head from 'next/head'


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

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </Head>

      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Component {...pageProps} />
      </div>
    </>
  )
}
