import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col w-screen h-full">
      <div className="flex w-screen h-full items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
