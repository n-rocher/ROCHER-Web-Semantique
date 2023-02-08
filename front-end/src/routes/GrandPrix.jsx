
import React from "react";
import { useParams, useLoaderData } from "react-router";

export default function GrandPrix() {

  let params = useParams();
  const data = useLoaderData();

  console.log(params, data)

  return <h1>GeeksForGeeks</h1>;
}