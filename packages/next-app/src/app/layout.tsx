import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scoped SSR slot reproduction",
  description:
    "A minimal reproduction for testing Stencil components with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
