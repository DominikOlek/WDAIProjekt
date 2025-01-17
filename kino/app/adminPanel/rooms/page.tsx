"use client";

import React, { useEffect } from "react";
import { getData } from "../methods";
import AddRoom from "./addRoom";

export default function rooms() {
  let [roomList, update] = React.useState([]);
  useEffect(() => {
    getRooms();
  }, []);
  function getRooms() {
    let a = getData("room/");
    console.log(a);
    a.then((data) => {
      console.log(data);
      update(data);
    });
  }
  let del = (e: any) => {};
  return (
    <div>
      {roomList.map((e: any) => {
        return (
          <div>
            <h3>id: {e.Number}</h3>
            <h3>ScreenSize: {e.ScreenSize}</h3>
            <h3>3D: {e.Is3D ? "true" : "false"}</h3>
            <h3>4D: {e.Is4D ? "true" : "false"}</h3>
            <h3>IMAX: {e.IsIMAX ? "true" : "false"}</h3>
            <h3>ScreenX: {e.IsScreenX ? "true" : "false"}</h3>
            <button onClick={del} value={e.Number}>
              delete
            </button>
          </div>
        );
      })}
      <AddRoom></AddRoom>
    </div>
  );
}
