import React from "react";
import { FaXmark } from "react-icons/fa6";

const ResultsCard = ({ pesel, date, results, removeResult }) => {
  return (
    <div className="flex h-max min-w-fit flex-col items-center justify-center rounded-md mb-4 border-2 border-black">
      <div className="flex w-fit flex-col">
        <div className="divide-y divide-black">
          <div className="flex min-w-[14rem] flex-row items-center justify-between p-2 text-center text-lg">
            <div className="mx-auto font-dmser text-pale-sky-700">{date.replaceAll("-", ".")}</div>

            <FaXmark onClick={removeResult} className="text-old-rose hover:cursor-pointer" />
          </div>
          <div className="p-3">
            {Object.keys(results).filter((element) => element !== "test_names" && element !== "name")
              .map((element) => (
                <div key={element} className="text-md">
                  {element} – {results[element]}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
