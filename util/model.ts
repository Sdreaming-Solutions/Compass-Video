export type Type = "movie" | "series" | "season";

export interface Media {
  adult?: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  original_name?: string;
  original_title?: string;
  title?: string;
  release_date?: string;
  name?: string;
  first_air_date?: string;
  video?: boolean;
  origin_country?: string[];
  season_number?: number;
  show_id?: number;
  media_type?: string;
  type: Type;
}

export interface DetailedMedia extends Media {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_episodes?: number;
  episodes?: Episode[];
}

export interface Series extends Media {
  origin_country: string[];
  id: number;
  number_of_seasons?: number;
  seasons?: Series[];
  name?: string;
}

export interface SeriesInfo{
  id: number;
  number_of_seasons: number;
  seasons: Series[];
  name: string;
}

export interface Episode{
  id: number;
  name: string;
  still_path: string;
  overview: string;
  episode_number: number;
  runtime: number;
  type: Type;
}

export interface Person{
  id: number;
  name: string;
  profile_path: string;
  popularity: number;  
}

export interface Season extends Media{
  episodes: Episode[],
  id:number,
}
