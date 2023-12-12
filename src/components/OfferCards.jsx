import React from "react";
import OfferCard from "./OfferCard";

const OfferCards = ({ offers }) => {
  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3">
      {offers.map((offer) => {
        return (
          <OfferCard
            key={offer.id}
            offerName={offer.name}
            tests={offer.tests}
          />
        );
      })}
    </div>
  );
};

export default OfferCards;
