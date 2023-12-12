import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import AssistantHome from "./AssistantHome";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMsg from "../components/ErrorMsg";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const navigateToLoginPage = () => navigate("/login");

  const homeContent =
    user !== null ? (
      <AssistantHome user={user} />
    ) : (
      <>
        <img
          src="/medicine.svg"
          alt="two assistants in the lab"
          className="w-1/3 pb-0 pe-10  ps-10"
        />
        <img src="/ilab.svg" alt="ilab name" className="w-28 p-0" />
        <p className="m-0 w-[28rem] p-0 text-center text-lg text-pale-sky-700">
          Sieć najnowocześniejszych laboratoriów diagnostycznych w Polsce,
          oferująca ponad 250 badań
        </p>

        <button
          className="mt-8 rounded-xl border-black bg-old-rose-300  px-8 py-4 font-dmser text-2xl tracking-wider text-pale-sky-700 "
          onClick={navigateToLoginPage}
        >
          Zaloguj się ➢
        </button>
      </>
    );
  const loadingContent = loading ? LoadingSpinner() : homeContent;
  const pageContent = error ? ErrorMsg(error) : loadingContent;

  return (
    <div className="flex h-full w-screen flex-col items-center justify-center gap-4">
      {pageContent}
    </div>
  );
};

export default HomePage;
