import { ip } from "../interfaces";
import { getCookie } from "./methods";

export default function Login() {
  function login(e: any) {
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
        Password: e.target.password.value,
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
    <form onSubmit={login}>
      <input type="text" name="login"></input>
      <input type="password" name="password"></input>
      <input type="submit"></input>
    </form>
  );
}
