"use client";
import { useEffect } from "react";
import "./style.css";
import React from "react";
import MovieDisplay from "./MovieDisplay";
import { Movie, Time, Screening, ip } from "../interfaces";
import { getAllScreenings } from "../login/methods";
export default function Home() {
  const [movieList, updateMovieList] = React.useState<Screening[]>([]);
  const [filteredMovies, setFilteredMovies] = React.useState<Screening[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    let x: Promise<Screening[]> = getAllScreenings();
    console.log("x:", x);
    x.then((data) => {
      updateMovieList(data);
      setFilteredMovies(data);
    });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filteredList = movieList.filter((movie) =>
      movie.movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filteredList);
  };

  function generateMovieList() {
    return filteredMovies.map((e: Screening) => {
      return <MovieDisplay screening={e} key={e.id}></MovieDisplay>;
    });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={handleSearch}
      />
      {generateMovieList()}
    </div>
  );
}
