"use client";
import { Screening } from "@/app/interfaces";
import { useParams } from "next/navigation";

export default function Page() {
  const router = useParams();
  console.log(router);
  return <div></div>;
}
