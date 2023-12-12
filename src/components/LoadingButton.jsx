import React from "react";

const LoadingButton = () => {
  return (
    <button
      type="button"
      className="mb-1 mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-md bg-smalt-blue-600 px-6 pb-[calc(4.5*0.25rem)] pt-[calc(4.5*0.25rem)]  text-center text-lg font-bold leading-6 text-white shadow transition duration-150 ease-in-out hover:cursor-pointer hover:bg-smalt-blue-400"
      disabled=""
    >
      <svg
        className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Ładowanie...
    </button>
  );
};

export default LoadingButton;
