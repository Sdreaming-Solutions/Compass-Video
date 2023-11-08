/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Header from "@/app/components/header";
import styles from "./Actors.module.scss";
import Carousel from "@/app/components/carousel";
import tmdb from "@/util/tmdb";
import { Media } from "@/util/model";
const defaultImagePoster = "/carouseldefault.png";
const randomNumber = Math.floor(Math.random() * 19);

export default async function ActorCredits() {
  const actors = await tmdb.getPeopleList();
  const firstActor = await tmdb.getCreditsActor(actors[0].id);
  let media;
  const actorMedias: Media[][] = [];
  for (let i = 0; i < actors.length; i++) {
    media = await tmdb.getCreditsActor(actors[i].id);
    actorMedias.push(media);
  }
  function getImage(path: string) {
    if (path) {
      return `https://image.tmdb.org/t/p/w342${path}`;
    }
    return defaultImagePoster;
  }

  return (
    <div className={styles.maincontent}>
      <Header item={await tmdb.detailedMedia(firstActor[randomNumber])} autoUpdate buttons={["watch", "info", "controls"]}/>
      {actorMedias.map((item: Media[], index) => (
        <div key={index} className={styles.content}>
          <Carousel items={item} title="Conhecido(a) por"/>
          <div className={styles.actor}>
            <h2>{actors[index].name}</h2>
            <img
              src={getImage(actors[index].profile_path)}
              className={styles.actorimage}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
