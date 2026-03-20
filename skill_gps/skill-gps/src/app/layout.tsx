import type { Metadata } from "next";
import "./globals.css";
import { StudentProvider } from "@/lib/StudentContext";

export const metadata: Metadata = {
  title: "Skill GPS — AI-Powered Career Development Platform",
  description: "Analyze your academic data, identify skill gaps, and get personalized career roadmaps powered by AI. Track your journey from student to professional.",
  keywords: "skill gaps, career development, AI career mentor, student roadmap, employability",
  openGraph: {
    title: "Skill GPS — Navigate Your Career with AI",
    description: "Your AI-powered career GPS. Know where you are, where you're going, and exactly how to get there.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StudentProvider>
          {children}
        </StudentProvider>
      </body>
    </html>
  );
}
