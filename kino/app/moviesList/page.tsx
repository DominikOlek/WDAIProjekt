"use client";
import { useEffect } from "react";
import "./style.css";
import React from "react";
import MovieDisplay from "./MovieDisplay";
import { Movie, Time, Screening } from "../interfaces";
export default function Home() {
  const [movieList, updateMovieList] = React.useState<Screening[]>([]);
  useEffect(() => {
    fetch("http://192.168.1.103:5000/movie", {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }) // Replace '/data' with the correct endpoint on port 5000
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        console.log("Response from server on port 5000:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    let a: Movie = {
      img: "https://cdn.kobo.com/book-images/2bd0e164-5c02-4e40-a43a-17d2fd5451b7/1200/1200/False/dune-2.jpg",
      title: "Dune",
      Description: "A lot od sand",
      length: 9,
    };
    let b: Time = { hour: 10, minute: 10 };
    let d: Date = new Date();
    let c: Screening = {
      movie: a,
      date: d,
      time: b,
    };

    let movies: Screening[] = [c];
    updateMovieList(movies);
  }, []);

  function generateMovieList() {
    return movieList.map((e: Screening) => {
      return <MovieDisplay screening={e}></MovieDisplay>;
    });
  }
  return <div>{generateMovieList()}</div>;
}
