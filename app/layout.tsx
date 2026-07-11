import type { Metadata } from "next";
import { Share_Tech_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Scanlines from "./components/fx/Scanlines";
import SmokeRingBackground from "./components/fx/SmokeRingBackground";

const shareTech = Share_Tech_Mono({
  variable: "--font-share-tech",
  weight: "400",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Intelligence Engine",
  description:
    "AI-powered resume analysis — see your resume through the eyes of a recruiter, ATS, hiring manager, and technical interviewer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${shareTech.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmokeRingBackground />
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
        <Scanlines />
      </body>
    </html>
  );
}
