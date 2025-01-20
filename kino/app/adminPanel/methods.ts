import { ip } from "../interfaces";
import { getToken } from "../login/methods";

export let getData = async (url: string) => {
  let x = fetch(`http://${ip}:5000/${url}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  return await x.then((data) => {
    return data;
  });
};

export let deleteRoom = async (url: string) => {
  let t = "Bearer " + getToken();
  console.log(t);
  let x = fetch(`http://${ip}:5000/${url}`, {
    method: "DELETE",
    mode: "cors",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJkb21pbmlrQGdtYWlsLmNvbSIsIm5hbWUiOiJEb21pbmlrIiwibGFzdG5hbWUiOiJPbGVrc3kiLCJyb2xlIjoiTWFuYWdlciIsImlhdCI6MTczNjA4MzgyMCwiZXhwIjoxNzM4MDgzODIwfQ.hvUWmTZ3rae2t7EczlwXZkA9upGDAekDKFGpwPTebGQ",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      alert("usunięto");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Error fetching data:" + error);
    });
};
