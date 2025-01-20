"use client";

import React, { useEffect } from "react";
import { deleteRoom, getData } from "../methods";
import AddRoom from "./addRoom";
import "../../style.css";
import { useRouter } from "next/navigation";
export default function rooms() {
  let router = useRouter();
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
  let del = (e: any) => {
    console.log(e.target.value);
    deleteRoom(`room/delete${e.target.value}`);
    getRooms();
    router.push("/adminPanel");
  };
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
