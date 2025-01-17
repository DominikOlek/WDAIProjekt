"use client";

import React from "react";
import { Reserved } from "../interfaces";
export default function Seat(props: {
  selected: boolean;
  position: { x: number; y: number };
  reserve: Function;
  id: number;
  occupied: boolean;
}) {
  const [selected, select] = React.useState(props.selected);
  function click() {
    if (!props.occupied) {
      let reservation: Reserved = {
        id: props.id,
        x: props.position.x,
        y: props.position.y,
        selected: !selected,
      };
      props.reserve(reservation);
      select((e) => !e);
    }
  }
  return !props.occupied ? (
    selected ? (
      <div className="seatSelected" onClick={click}></div>
    ) : (
      <div className="seat" onClick={click}></div>
    )
  ) : (
    <div className="occupied"></div>
  );
}
