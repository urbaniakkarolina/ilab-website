import React, { useCallback, useEffect, useState } from "react";
import { getOffers } from "../firebase";
import OfferCards from "../components/OfferCards";
import LoadingSpinner from "../components/LoadingSpinner";

const OfferPage = () => {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  const fetchOffers = useCallback(async () => {
    const offersFromDatabase = await getOffers();
    setOffers([...offersFromDatabase]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <div className="flex h-max w-screen flex-col items-center justify-center gap-5 p-2">
      <h1 className="font-dmser mb-4 text-3xl text-pale-sky-800">Dostępne pakiety badań</h1>
      {loading ? <LoadingSpinner /> : <OfferCards offers={offers} />}
    </div>
  );
};

export default OfferPage;
