import React from "react";
import { Provider } from "@/store";
import type { Metadata } from "next";
import * as fonts from "@/styles/fonts";
import NavBar from "../components/navbar";
import Footer from "../components/ui/footer/Footer";

export const metadata: Metadata = {
  title: "Compass Video",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <NavBar />
      {children}
      <Footer/>
    </>
  );
}
