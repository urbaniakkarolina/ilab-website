import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IconContext } from "react-icons";

const Description = ({ text }) => {
  return <div className="border border-black bg-gray-50 rounded-md p-4 w-fit min-w-fit">{text}</div>;
};
const LocationPin = ({ text }) => {
  const [descVisible, setDescVisible] = useState(false);
  return (
    <div
      onMouseOver={() => setDescVisible(true)}
      onMouseLeave={() => setDescVisible(false)}
    >
      <IconContext.Provider value={{ size: "2.5em", color: "red" }}>
        <FaLocationDot />
        {descVisible ? <Description text={text} /> : ""}
      </IconContext.Provider>
    </div>
  );
};

export default LocationPin;
