import Header from "@/app/components/header";
import Carousel from "@/app/components/carousel";
import tmdb from "@/util/tmdb";
import styles from "./Series.module.scss";
export default async function page() {
  const airingtoday = await tmdb.detailedMediaMultiple(
    await tmdb.airingTodaySeries
  );
  const popular = await tmdb.detailedMediaMultiple(await tmdb.popularSeries);
  const toprated = await tmdb.detailedMediaMultiple(await tmdb.topRatedSeries);
  const ontheair = await tmdb.detailedMediaMultiple(await tmdb.onTheAirSeries);
  const topseries = await tmdb.detailedSeries(toprated[0].id);

  return (
    <div>
      <Header
        item={topseries}
        autoUpdate={true}
        buttons={["watch", "info", "controls"]}
      />
      <div className={styles.content}>
        <Carousel
          items={airingtoday}
          title="Lançamentos"
          updateBanner
          autoplay={3000}
        />
        <Carousel items={popular} title="Populares" />
        <Carousel items={ontheair} title="Estão no ar" />
        <Carousel items={toprated} title="Mais bem avaliados" />
      </div>
    </div>
  );
}
