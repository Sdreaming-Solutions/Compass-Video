import type { Metadata } from "next";
import { montserrat } from "@/styles/fonts";
import StyledComponentsRegistry from "./lib/registry";

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
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
