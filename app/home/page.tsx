import React from "react";
import tmdb from "@/util/tmdb";
import style from "./Home.module.scss";
import Episodelist from "../components/ui/episodelist";
import Carousel from "../components/carousel";
import Header from "../components/header";

type Props = {};

export const revalidate = 60;

export default async function Home({}: Props) {
  const popular = await tmdb.detailedMediaMultiple(await tmdb.popular);

  return (
    <div className={style.maincontent}>
      <Header item={popular![0]} autoUpdate />
      <Carousel items={popular!} title="Popular" autoplay={3000} updateBanner />
      <Episodelist id_serie={1399} season_number={1} />
    </div>
  );
}
