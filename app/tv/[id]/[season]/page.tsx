import Episodelist from "@/app/components/ui/episodelist";
import styles from "../Tv.module.scss";
import Header from "@/app/components/header";
import tmdb from "@/util/tmdb";
import { Media } from "@/util/model";

type Props = {
  params: {
    id: number;
    season: number;
  };
};
export default async function Tv({ params }: Props) {
  const media = await tmdb.getSerie(params.id);
  if (media) {
    const detailsMedia = await tmdb.detailedSeries(media);
    return (
      <div className={styles.series__containerA}>
        <Header item={detailsMedia} autoUpdate />
        <Episodelist id_serie={params.id} season_number={params.season} />
      </div>
    );
  }
}