import type { Metadata } from "next";
import { Quicksand, Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nairobi Spaces",
  description: "Verified short-stay accommodation in Nairobi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${raleway.variable} font-body bg-white text-dark antialiased`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}