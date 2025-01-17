export interface Movie {
  title: string;
  description: string;
  img: string;
  length: number;
}
export interface Time {
  hour: number;
  minute: number;
}
export interface Screening {
  id: number;
  movie: Movie;
  date: Date;
  time: Time;
  seats: number[][];
}
export interface Reserved {
  id: number;
  x: number;
  y: number;
  selected: boolean;
}
let ip = "192.168.1.103";
export { ip };
