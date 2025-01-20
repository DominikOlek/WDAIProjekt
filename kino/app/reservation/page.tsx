"use client";
import React, { useEffect } from "react";
import Seat from "./Seat";
import "../style.css";

import "./style.css";
import { Reserved, Screening } from "../interfaces";
import { useSearchParams } from "next/navigation";
import { getScreeningByID, placeOrder } from "../login/methods";

export default function Page() {
  const searchParams = useSearchParams();
  const screening = searchParams.get("title") | 0;
  const [reserved, reserveSeat] = React.useState<Reserved[]>([]);
  const [movieData, updateData] = React.useState<Screening>();
  useEffect(() => {
    getScreeningByID(screening).then((data) => {
      updateData(data);
      console.log("AA");
      console.log(data);
    });
  }, []);
  function generateSeats(n: number) {
    let tab = [];

    for (let i = 0; i < n; i++) {
      tab.push(generateRow(n, i));
    }
    return tab;
  }

  function reserve(e: Reserved) {
    if (e.selected) {
      reserveSeat([...reserved, e]);
    } else {
      reserveSeat(reserved.filter((reservation) => reservation.id != e.id));
    }

    console.log(reserved);
  }

  function generateRow(n: number, a: number) {
    let tab = [];
    for (let i = 0; i < n; i++) {
      let occupied = false;
      if (movieData != undefined) {
        if (movieData.seats[a][i] == 1) {
          occupied = true;
        }
      }
      // let ok: boolean = movieData.seats[a][i];
      tab.push(
        <Seat
          key={n * a + i}
          id={n * a + i}
          selected={false}
          occupied={occupied}
          position={{ x: a, y: i }}
          reserve={reserve}
        />
      );
    }
    tab.push(<br></br>);
    return tab;
  }

  function send(e: any) {
    alert("ok");

    e.preventDefault();
    let conv: any = [];
    reserved.forEach((e) => {
      conv.push([e.x, e.y, e.selected ? 1 : 0]);
    });
    console.log(conv);
    if (movieData != undefined) {
      placeOrder(
        e.target.firstName.value,
        e.target.lastName.value,
        e.target.email.value,
        movieData?.id,
        conv
      );
    }
  }

  return (
    <div>
      {movieData == undefined ? "" : generateSeats(movieData.seats.length)}
      <div></div>
      <form onSubmit={send}>
        <label>Złóż zamówienie</label>
        <br></br>
        <input name="firstName" type="text" placeholder="firstName" />
        <input name="lastName" type="text" placeholder="lastName" />
        <input name="email" type="text" placeholder="email" />
        <input type="submit" value="submit"></input>
      </form>
    </div>
  );
}
