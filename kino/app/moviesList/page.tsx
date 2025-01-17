"use client";
import { useEffect } from "react";
import "./style.css";
import React from "react";
import MovieDisplay from "./MovieDisplay";
import { Movie, Time, Screening, ip } from "../interfaces";
import { getAllScreenings } from "../login/methods";
export default function Home() {
  const [movieList, updateMovieList] = React.useState<Screening[]>([]);
  let getMovie = () => {
    // console.log(x[0]);
    // return x;
  };
  useEffect(() => {
    let x: Promise<Screening[]> = getAllScreenings();
    console.log("x:", x);
    x.then((data) => {
      updateMovieList(data);
    });
  }, []);

  function generateMovieList() {
    return movieList.map((e: Screening) => {
      return <MovieDisplay screening={e}></MovieDisplay>;
    });
  }
  return <div>{generateMovieList()}</div>;
}
