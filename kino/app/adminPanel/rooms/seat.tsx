"use client";

import React from "react";
import { Position } from "../../interfaces";
import "../../reservation/style.css";
export default function Seat(props: {
    selected: boolean;
    position: Position;
    change: Function;
}) {
    const [selected, select] = React.useState(props.selected);
    function click() {
        props.change(props.position,selected?-1:0);
        select((e) => !e);
    }
    return selected ? (
            <div className="occupied" onClick={click}></div>
        ) : (
            <div className="seat" onClick={click}></div>
        )
}