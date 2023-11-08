"use client";

import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";
import styles from "./Navbar.module.scss";
import { usePathname } from "next/navigation";

type Props = {
  href: Url;
  current?: string;
  icon?: React.FC<React.SVGAttributes<SVGElement>>;
};

export default function Navlink({
  href,
  children,
  current,
  icon: Icon,
}: React.PropsWithChildren<Props>) {
  return (
    <Link
      href={href}
      className={`${styles.navlink} ${
        current?.startsWith(href.toString()) ? styles.active : ""
      }`}>
      {Icon && <Icon />}
      {children}
    </Link>
  );
}
