import React from "react";

const OfferCard = ({ offerName, tests }) => {

  return (
    <div className="m-2 w-fit rounded-lg border border-black bg-vanilla-ice-50 ">
      {/* Header */}
      <div className=" rounded-t-ml w-48 bg-smalt-blue-500 p-2 text-center text-lg text-zinc-50">
        {offerName.charAt(0).toUpperCase() + offerName.slice(1)}
        {/* slice(1) -metoda do wyodrębniania części ciągu znaków, począwszy od określonego indeksu */}
      </div>

      <ul className="list-inside list-disc p-4">
        {tests.map((testName) => {
          return <li key={testName}>{testName.replaceAll('"', "")}</li>;
        })}
      </ul>
    </div>
  );
};

export default OfferCard;
