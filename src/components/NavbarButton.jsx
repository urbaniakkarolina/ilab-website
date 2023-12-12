import React from "react";
import { Link } from "react-router-dom";

const NavbarButton = ({ link, text, onClick }) => {
  return (
    <Link
      to={link}
      className="border-black border text-black py-2 px-4 rounded-lg bg-old-rose-300"
      onClick={onClick}
    >
      {text}
    </Link>
  );
};

export default NavbarButton;
