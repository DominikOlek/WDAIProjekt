import { ip } from "@/app/interfaces";

export default function AddRoom() {
  function add(e: any) {
    console.log(e.target.password.value);
    console.log(e.target.login.value);
    e.target.login.value = "dominik2@gmail.com";
    e.target.password.value = "1234567";
    e.preventDefault();
    let x = fetch(`http://${ip}:5000/api/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        Number: e.target.number.value,
        Email: e.target.login.value,
      }),
    }).then((response) => {
      return response.json();
    });
    x.then((data) => {
      console.log(data);
      document.cookie = `token=${data.token}; refresh=${data.refresh}path=/; Secure; SameSite=Strict`;

      alert("zalogowano: \n" + data.token);
    });
  }

  return (
    <form onSubmit={add}>
      <input type="number" name="screenSize" placeholder="screenSize"></input>
      <input type="number" name="number" placeholder="number"></input>
      <input type="checkbox" name="imax" placeholder="imax"></input>
      <label>imax</label>

      <input type="checkbox" name="3d" placeholder="3d"></input>
      <label>3d</label>
      <input type="checkbox" name="4d" placeholder="4d"></input>
      <label>4d </label>

      <input type="submit"></input>
    </form>
  );
}
