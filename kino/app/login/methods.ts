import { ip, Reserved, Screening, Seat } from "../interfaces";

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2 && parts != undefined) {
    return parts.pop().split(";").shift();
  }
}
export function getToken() {
  let x = getCookie2("token");

  return x;
}
export function getUserData() {}

export function reserveSeats(seate: Reserved[], data: any) {}

function getCookie2(name: string) {
  let dc = document.cookie;
  let prefix = name + "=";
  let begin = dc.indexOf("; " + prefix);
  let end;
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    let end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}
let getAllScreenings = async (): Promise<Screening[]> => {
  let response: Screening[] = [];
  let x = fetch(`http://${ip}:5000/show`, {
    method: "POST",
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
    let screenings: Screening[] = [];
    for (let i = 0; i < data.length; i++) {
      let sc: Screening = {
        seats: data[i].Places,
        id: data[i].ID,
        movie: {
          img: "",
          title: data[i].Name,
          description: data[i].Describe,
          length: 100,
        },
        time: { hour: 1, minute: 1 },
        date: new Date(data[i].StartTime),
      };
      screenings.push(sc);
    }
    response = screenings;
    return response;
  });
};

let getScreeningByID = async (id: number): Promise<Screening> => {
  let response: Screening[] = [];
  let x = fetch(`http://${ip}:5000/show/${id}`, {
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
    let sc: Screening = {
      seats: data.Places,
      id: data.ID,
      movie: {
        img: "",
        title: data.Name,
        description: data.Describe,
        length: 100,
      },
      time: { hour: 1, minute: 1 },
      date: new Date(data.StartTime),
    };

    return sc;
  });
};
let placeOrder = async (
  firstName: string,
  lastName: string,
  email: string,
  seats: Seat[],
  ScreeningId: number
) => {};
export { getAllScreenings };
export { getScreeningByID };
