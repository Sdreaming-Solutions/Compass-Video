import type { Metadata } from "next";
import { montserrat } from "@/styles/fonts";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "Compass Video",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>{children}</body>
    </html>
  );
}
