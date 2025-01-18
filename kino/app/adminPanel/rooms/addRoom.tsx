import { ip } from "@/app/interfaces";
import React, { useEffect } from "react";
import { Position } from "../../interfaces"
import Seat  from "../rooms/seat"

export default function AddRoom() {
    const [width, setWidth] = React.useState(3);
    const [height, setHeight] = React.useState(3);
    const [grid, setGrid] = React.useState(
        Array.from({ length: height }, (_, row) => Array.from({ length: width }, (_, col) => (<Seat position={{ x: col, y: row }} selected={false} change={change} ></Seat>)))
    );

    const [stat, setStat] = React.useState(
        Array.from({ length: height }, (_, row) => Array.from({ length: width }, (_, col) => (0)))
    );

    useEffect(() => {
        setGrid(prevGrid => {
            const newGrid = Array.from({ length: height }, (_, row) =>
                Array.from({ length: width }, (_, col) =>
                    (prevGrid[row]?.[col] !== undefined ? prevGrid[row][col] : (<Seat position={{ x: col, y: row }} selected={false} change={change} ></Seat>))
                )
            );
            return newGrid;
        });
        setStat(prevStat => {
            const newGrid = Array.from({ length: height }, (_, row) =>
                Array.from({ length: width }, (_, col) =>
                    (prevStat[row]?.[col] !== undefined ? prevStat[row][col] : (0))
                )
            );
            return newGrid;
        });
    }, [width, height]);

    function change(position:Position,stat:number) {
        setStat((prevStat) =>
            prevStat.map((row, rowIndex) =>
                rowIndex === position.x
                    ? row.map((cell, colIndex) =>
                        colIndex === position.y ? stat : cell
                    )
                    : row
            )
        );
    }

  function add(e: any) {

    e.preventDefault();
      let x = fetch(`http://${ip}:5000/room/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJkb21pbmlrQGdtYWlsLmNvbSIsIm5hbWUiOiJEb21pbmlrIiwibGFzdG5hbWUiOiJPbGVrc3kiLCJyb2xlIjoiTWFuYWdlciIsImlhdCI6MTczNjA4MzgyMCwiZXhwIjoxNzM4MDgzODIwfQ.hvUWmTZ3rae2t7EczlwXZkA9upGDAekDKFGpwPTebGQ'
      },

      body: JSON.stringify({
        Number: Number(e.target.number.value),
        Places: stat,
          ScreenSize: e.target.screenSize.checked ,
        Is3D: e.target.threed.checked,
          IsIMAX: e.target.imax.checked,
          Is4D: e.target.fourd.checked,
          IsScreenX: e.target.screenX.checked,
      }),
    }).then((response) => {
      return response.json();
    });
    x.then((data) => {
      console.log("ok");
    });
  }

  return (
      <form onSubmit={add}>
          <label>Width: </label>
          <input
              type="number"
              value={width}
              min="0"
              max="50"
              onChange={(e) => setWidth(Number(e.target.value))}
          />
          <label>Height: </label>
          <input
              type="number"
              value={height}
              min="0"
              max="50"
              onChange={(e) => setHeight(Number(e.target.value))}
          />
          <table>
          <tbody>
          {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                      <td key={colIndex}>{grid[rowIndex][colIndex]}</td>
                  ))}
              </tr>
          ))}
        </tbody>
        </table >
      <input type="number" name="screenSize" placeholder="screenSize"></input>
      <input type="number" name="number" placeholder="number"></input>
      <input type="checkbox" name="imax" placeholder="imax"></input>
      <label>imax</label>

      <input type="checkbox" name="threed" placeholder="3d"></input>
      <label>3d</label>
      <input type="checkbox" name="fourd" placeholder="4d"></input>
        <label>4d </label>
        <input type="checkbox" name="screenX" placeholder="4d"></input>
        <label>ScreenX </label>

      <input type="submit"></input>
    </form>
  );
}
