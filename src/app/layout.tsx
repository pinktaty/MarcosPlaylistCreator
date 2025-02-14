import type { Metadata } from "next";
import "./globals.css";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Marcos' Playlist Creator",
  description: "A little project for a pretty man.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <title>Marcos' Playlist Creator</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <div className="">
      {children}
    </div>
    </body>
    </html>
  );
}
