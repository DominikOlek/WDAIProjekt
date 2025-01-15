"use client";
import React from "react";
import Seat from "./Seat";
import "./style.css";
import { Reserved } from "../interfaces";
export default function Page() {
  const [reserved, reserveSeat] = React.useState<Reserved[]>([]);
  function generateSeats(n: number) {
    let tab = [];

    for (let i = 0; i < n; i++) {
      tab.push(generateRow(n, i));
    }
    return tab;
  }
  function generateRow(n: number, a: number) {
    let tab = [];
    for (let i = 0; i < n; i++) {
      tab.push(
        <Seat
          key={n * a + i}
          id={n * a + i}
          selected={false}
          position={{ x: a, y: i }}
          reserve={reserve}
        />
      );
    }
    tab.push(<br></br>);
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
  function send() {
    console.log(reserved);
  }
  return (
    <div>
      {generateSeats(6)}
      <button onClick={send}>reserve</button>
    </div>
  );
}
