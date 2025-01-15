import Link from "next/link";
import { Screening } from "../interfaces";
import "./style.css";
export default function movieDisplay(props: { screening: Screening }) {
  return (
    <div>
      <Link href={`/reservation`}>
        <img src={props.screening.movie.img} />
        <h1>{props.screening.movie.title}</h1>
        <h3>{props.screening.movie.Description}</h3>
      </Link>
    </div>
  );
}
