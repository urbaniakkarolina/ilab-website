import React from "react";
import Map from "../components/Map";

const MapPage = () => {
  const locations = [
    { address: "Sienkiewicza 110, 50-361 Wrocław", lat: 51.11, lng: 17.04 },
    {
      address: "plac Świętego Macieja 8, 53-110 Wrocław",
      lat: 51.1,
      lng: 17.04,
    },
    {
      address: "plac Grunwaldzki 18-20, 50-384 Wrocław",
      lat: 51.11,
      lng: 17.05,
    },
    { address: "Zakładowa 11h, 50-231 Wrocław", lat: 51.1, lng: 17.02 },
    {
      address: "Generała Romualda Traugutta 142, 50-420 Wrocław",
      lat: 51.12,
      lng: 17.03,
    },
  ];
  return (
    <div className="h-full w-screen p-12">
      <iframe src="https://www.google.com/maps/d/embed?mid=1BOIpNqpBzBnXOOpNzd0aoIGNqU5CYqI&ehbc=2E312F" className="w-full h-full"></iframe>
    </div>
  );
};

export default MapPage;
