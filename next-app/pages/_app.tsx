import '@fontsource/maple-mono';
// import { Geist, Geist_Mono, } from "next/font/google";
import '../styles/globals.css'
import Head from 'next/head'
import { AppProps } from "next/app";
import { Metadata } from 'next';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "bobers",
//   description: "Better webapp in the world.",
// };

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>anturated</title>
      </Head>
      <div
        className={`antialiased`}
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Component {...pageProps} />
      </div>
    </>
  )
}
