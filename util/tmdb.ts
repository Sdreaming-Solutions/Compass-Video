import { Media, Season, Series, DetailedMedia, Type, Episode } from "./model";

export class TMDB {
  static instance?: TMDB;
  baseURL = new URL("https://api.themoviedb.org/3/");
  headers = {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTUzYjk2MmY2Nzg2MGY2NjAxMjc4YTE1ZDdjNmVkMSIsInN1YiI6IjY1NDRlODAyNmJlYWVhMDEwYjMyNGVkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EWLmbWqxpkl0X_f3SicwD20Jee8zD-jls2pKLq6Qohs",
  };

  private constructor() {}

  static getInstance() {
    return this.instance || (this.instance = new TMDB());
  }

  async get(path: string) {
    const url = new URL(path, this.baseURL);
    const res = await fetch(url, { headers: this.headers });

    if (!res.ok)
      throw { message: `Could not fetch from ${url}`, status: res.status };

    return res.json();
  }

  private popularMedia(media: string) {
    return this.get(`${media}/popular?language=en-US&page=1`).then(
      (data) => data.results
    );
  }

  async post(path: string, body: any) {
    const url = new URL(path, this.baseURL);
    const res = await fetch(url, {
      method: "POST",
      headers: { ...this.headers, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(res.body);

    if (!res.ok)
      throw { message: `Could not post to ${url}`, status: res.status };

    return res.json();
  }

  private extractCommon(res: any) {
    return {
      adult: res.adult,
      backdrop_path: res.backdrop_path,
      genre_ids: res.genre_ids,
      id: res.id,
      original_language: res.original_language,
      overview: res.overview,
      popularity: res.popularity,
      poster_path: res.poster_path,
      vote_average: res.vote_average,
      vote_count: res.vote_count,
      genres: res.genres,
    };
  }

  async detailedMovie(id: number): Promise<DetailedMedia> {
    const res = await this.get(`movie/${id}?language=en-US`);

    return {
      ...this.extractCommon(res),
      runtime: res.runtime,
      original_title: res.original_title,
      title: res.title,
      release_date: res.release_date,
      video: res.video,
      type: "movie",
    };
  }

  async detailedSeries(id: number): Promise<DetailedMedia> {
    const res = await this.get(`tv/${id}?language=en-US`);
    return {
      ...this.extractCommon(res),
      original_name: res.original_name,
      name: res.name,
      first_air_date: res.first_air_date,
      origin_country: res.origin_country,
      number_of_episodes: res.number_of_episodes,
      type: "series",
    };
  }

  async detailedSeason(season: Media): Promise<DetailedMedia> {
    const res = await this.get(
      `tv/${season.id}/season/${season.season_number}?language=en-US`
    );
    return {
      ...this.extractCommon(res),
      episodes: res.episodes,
      type: "season",
    };
  }

  async detailedMedia(media: Media) {
    switch (media.type) {
      case "movie":
        return this.detailedMovie(media.id);
      case "series":
        return this.detailedSeries(media.id);
      case "season":
        return this.detailedSeason(media);
    }
  }

  async detailedMediaMultiple(medias: Media[]) {
    // DON'T USE FOR MORE THAN 20 REQUESTS PER SECOND
    const result = [];

    for (const item of medias) {
      result.push(await this.detailedMedia(item));
    }

    return result;
  }

  get popularMovies() {
    return (async () =>
      (await this.popularMedia("movie")).map((movie: Media) => ({
        ...movie,
        type: "movie",
      })))() as Promise<Media[]>;
  }

  get popularSeries() {
    return (async () =>
      (await this.popularMedia("tv")).map((series: Media) => ({
        ...series,
        type: "series",
      })))() as Promise<Media[]>;
  }

  get popular() {
    return (async () =>
      [...(await this.popularMovies), ...(await this.popularSeries)]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20))();
  }

  private async getMediaList(type: string, ref: string) {
    const mediadata = await this.get(
      `${type}/${ref}?language=en-US&page=1`
    ).then((data) => data.results);
    let typeMedia = "movie";
    if (type === "tv") {
      typeMedia = "series";
    }
    return (async () =>
      (await mediadata).map((media: Media) => ({
        ...media,
        type: typeMedia,
      })))() as Promise<Media[]>;
  }

  newMedia(path: string) {
    return this.get(
      `discover/${path}?include_video=true&language=en-US&page=1&sort_by=primary_release_date.desc`
    ).then((data) => data.results);
  }

  get newMovies() {
    return (async () =>
      (await this.newMedia("movie")).map((movie: Media) => ({
        ...movie,
        type: "movie",
      })))() as Promise<Media[]>;
  }

  get newSeries() {
    return (async () =>
      (await this.newMedia("series")).map((series: Media) => ({
        ...series,
        type: "series",
      })))() as Promise<Media[]>;
  }

  get fresh() {
    return (async () =>
      [...(await this.newMovies), ...(await this.newSeries)]
        .sort(
          (a, b) =>
            new Date(a.release_date || a.first_air_date!).getTime() -
            new Date(a.release_date || a.first_air_date!).getTime()
        )
        .slice(0, 20))();
  }

  get airingTodaySeries() {
    return this.getMediaList("tv", "airing_today");
  }

  get onTheAirSeries() {
    return this.getMediaList("tv", "on_the_air");
  }

  get topRatedSeries() {
    return this.getMediaList("tv", "top_rated");
  }

  get airingTodayMovie() {
    return this.getMediaList("movie", "now_playing");
  }

  get onTheAirMovie() {
    return this.getMediaList("movie", "upcoming");
  }

  get topRatedMovie() {
    return this.getMediaList("movie", "top_rated");
  }

  async getSerie(id: number) {
    try {
      const res = await this.get(`tv/${id}?language=en-US`);
      const seriedata: Series = {
        ...this.extractCommon(res),
        number_of_seasons: res.number_of_seasons,
        seasons: res.seasons,
        name: res.name,
        origin_country: res.origin_country,
        type: "series",
      };
      return seriedata;
    } catch (error) {
      console.error("Error getSeasonInfo", error);
      return null;
    }
  }

  private similarMedia(media: string, id: number) {
    return this.get(`${media}/${id}/similar?`).then((data) => data.results);
  }

  async getSimilarSerie(id: number) {
    return (async () =>
      (await this.similarMedia("tv", id)).map((series: Media) => ({
        ...series,
        type: "series",
      })))() as Promise<Media[]>;
  }

  async getSimilarMovie(id: number) {
    return (async () =>
      (await this.similarMedia("movie", id)).map((series: Media) => ({
        ...series,
        type: "movie",
      })))() as Promise<Media[]>;
  }
}

export default TMDB.getInstance();
