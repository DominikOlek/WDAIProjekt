import Link from "next/link";
import { Screening } from "../interfaces";
import "./style.css";
import { useRouter } from "next/navigation";
export default function movieDisplay(props: { screening: Screening }) {
  const router = useRouter();
  function handleNavigate() {
    router.push(`/reservation?title=${props.screening.id}`);
  }
  return (
    <div>
      <div onClick={handleNavigate}>
        <img
          src={"/img/" +props.screening.movie.img}
          alt="https://images.template.net/wp-content/uploads/2017/02/17221912/Printable-Blank-Movie-Poster.jpg"
        />
        <h1>{props.screening.movie.title}</h1>
        <h3>{props.screening.movie.description}</h3>
      </div>
    </div>
  );
}
