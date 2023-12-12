import React, { useState } from "react";
import LoginInput from "./LoginInput";
import { logInWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";
import LoadingButton from "./LoadingButton";

const handleSubmit = async (event, onSuccess, onError) => {
  event.preventDefault();
  const login = event.target[0].value;
  const password = event.target[1].value;

  const response = await logInWithEmailAndPassword(login, password);
  if (response.name !== "FirebaseError") {
    console.info(response);
    onSuccess();
  } else {
    onError(response.code);
    console.error(response);
  }
};

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/add-results");
  };

  return (
    <div className="flex flex-col items-center rounded-xl bg-gray-50 px-10 pb-10 shadow-[0_0_40px_rgba(8,7,16,0.6)] shadow-gray-500">
      <div className="my-5 p-5 text-4xl font-dmser  text-pale-sky-800">Panel logowania</div>
      <form
        onSubmit={async (event) => {
          setLoading(true);
          await handleSubmit(event, navigateToHome, setError);
          setLoading(false);
        }}
        className="w-fill flex min-w-[300px] flex-col items-start gap-2"
      >
        <div className="w-fill text-xl">Login</div>
        <LoginInput type="text" name="login" placeholder="" />
        <div className="w-fill text-xl">Hasło</div>
        <LoginInput type="password" name="password" placeholder="" />
        <h4>{error !== "" ? `Error: ${error}` : ""}</h4>
        {loading ? (
          <LoadingButton />
        ) : (
          <input
            type="submit"
            value="Zaloguj się"
            className="mb-1 mt-5 w-full rounded-md border border-pale-sky-200 bg-old-rose-300 px-6 py-4 text-2xl tracking-wider font-dmser text-pale-sky-700 hover:cursor-pointer"
          />
        )}
      </form>
    </div>
  );
};

export default LoginForm;
