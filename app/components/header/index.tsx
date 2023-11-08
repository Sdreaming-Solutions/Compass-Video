"use client";

import React from "react";
import styles from "./Header.module.scss";
import { DetailedMedia } from "@/util/model";
import { useSelector } from "@/store";
import Details from "./Details";

type Props = {
  item: DetailedMedia;
  autoUpdate?: boolean;
  buttons?: ("watch" | "trailer" | "info" | "controls")[];
};

export default function Header({ item, autoUpdate, buttons }: Props) {
  const dynamic = useSelector((state) => state.banner.media) || item;
  if (autoUpdate) item = dynamic;
  const backgroundImage = item.backdrop_path
    ? `url(https://image.tmdb.org/t/p/w1280${item.backdrop_path})`
    : `url(/default-banner/${Math.round(Math.random() * 4 + 1)}.gif)`;

  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: backgroundImage,
      }}>
      <div className={styles.gradients}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <Details item={item} buttons={buttons} />
    </header>
  );
}
