import React from "react";

const ErrorMsg = (error) => {
  console.error(error);
  return (
    <div>
      Oops.. something bad happened, check console for more information.
    </div>
  );
};

export default ErrorMsg;
