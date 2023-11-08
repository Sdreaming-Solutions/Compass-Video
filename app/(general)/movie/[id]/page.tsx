import React from "react";
import Header from "@/app/components/header";
import tmdb from "@/util/tmdb";
import { Media } from "@/util/model";
import Carousel from "@/app/components/carousel";
import styles from "./Movie.module.scss";

type Props = { params: { id: number } };

export default async function page({ params }: Props) {
  const media: Media = {
    id: params.id,
    type: "movie",
  } as Media;
  const movie = await tmdb.detailedMovie(media.id);
  const similares = await tmdb.getSimilarMovie(params.id);
  return (
    <div className={styles.movie__container}>
      <Header item={movie} buttons={["watch", "trailer", "controls"]} />F
      {similares.length ? <Carousel title="Similares" items={similares} /> : ""}
    </div>
  );
}
