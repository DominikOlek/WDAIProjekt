export interface Movie {
  title: string;
  Description: string;
  img: string;
  length: number;
}
export interface Time {
  hour: number;
  minute: number;
}
export interface Screening {
  movie: Movie;
  date: Date;
  time: Time;
}
export interface Reserved {
  id: number;
  x: number;
  y: number;
  selected: boolean;
}
