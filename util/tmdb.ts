import { Media, Series, DetailedMedia, Person } from "./model";

export class TMDB {
  static instance?: TMDB;
  baseURL = new URL("https://api.themoviedb.org/3/");
  headers = {
    accept: "application/json",
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

  private trendingMedia(type: string) {
    return this.get(`trending/${type}/week?language=en-US`).then(
      (data) => data.results
    );
  }

  get trendingMovies() {
    return (async () =>
      (await this.trendingMedia("movie")).map((movie: Media) => ({
        ...movie,
        type: "movie",
      })))() as Promise<Media[]>;
  }

  get trendingSeries() {
    return (async () =>
      (await this.trendingMedia("tv")).map((movie: Media) => ({
        ...movie,
        type: "series",
      })))() as Promise<Media[]>;
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

  async detailedCollection(id: number): Promise<DetailedMedia> {
    const res = await this.get(`collection/${id}?language=en-US`);
    return {
      ...this.extractCommon(res),
      parts: res.parts,
      original_name: res.original_name,
      name: res.name,
      release_date: "",
      type: "collection",
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
      case "collection":
        return this.detailedCollection(media.id);
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
  }

  async getCreditsActor(id: number) {
    const data = await this.get(`person/${id}/combined_credits?language=en-US`);
    const credits = data.cast.map((media: Media) => ({
      ...this.extractCommon(media),
      type: media.media_type === "tv" ? "series" : media.media_type,
    }));
    return credits
      .sort((a: Media, b: Media) => b.popularity - a.popularity)
      .slice(0, 20);
  }

  async getPeopleList(): Promise<Person[]> {
    const data = await this.get(`trending/person/week?language=en-US`);
    const people = data.results.map((person: Person) => ({
      id: person.id,
      name: person.name || "",
      profile_path: person.profile_path || "",
      popularity: person.popularity,
    }));

    return people.slice(4, 8);
    //.sort((a: Media, b: Media) => b.popularity - a.popularity)
  }

  async getKeyVideo(id: number, type: string) {
    return this.get(`${type}/${id}/videos?language=en-US`).then(
      (data) => data.results
    );
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

  async search(type: string, value: string ): Promise<Media[]> {
    switch (type) {
      case "Tudo":
        type = "multi";
        break;
      case "Filmes":
        type = "movie";
        break;
      case "Coleções":
        type = "collection";
        break;
      case "Séries":
        type = "tv";
        break;
      case "Celebridades":
        type = "person";
        break;
    }

    const res = (
      await this.get(
        `search/${type}?query=${value}&include_adult=false&language=en-US&page=1`
      )
    ).results;

    return res.map((item: Media | Person) => {
      if (type === "multi") {
        return item;
      } else {
        return { ...item, media_type: type };
      }
    });
  }
}

export default TMDB.getInstance();
