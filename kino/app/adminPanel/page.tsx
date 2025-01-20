"use client";

import Link from "next/link";
import Login from "../login/Login";
import "../style.css";
export default function AdminPage() {
  return (
    <div>
      <Login></Login>

      <Link href={"/adminPanel/rooms"}>Rooms</Link>
    </div>
  );
}
