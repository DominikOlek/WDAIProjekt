import { ip } from "../interfaces";

let getData = async (url: string) => {
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
export { getData };
