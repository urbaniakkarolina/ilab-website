import React from "react";

const LoginInput = ({ type, name, placeholder }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="text-md mb-4 w-full rounded-md border border-gray-300 bg-gray-50 p-3 focus:border-old-rose active:border-old-rose"
    ></input>
  );
};

export default LoginInput;
