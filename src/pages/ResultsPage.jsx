import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ResultsCard from "../components/ResultsCard";
import {
  auth,
  getAssistantEnteredResults,
  getAllResults,
  removeResult,
} from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";

const ResultsPage = () => {
  const [loadingFirestore, setLoadingFirestore] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [user, firebaseLoading, error] = useAuthState(auth);
  const [results, setResults] = useState({});
  const [enteredResults, setEnteredResults] = useState({});

  useEffect(() => {
    setLoadingFirestore(true);
    if (user !== null) {
      getAssistantEnteredResults(user.email).then((_enteredResults) => {
        if (Object.keys(_enteredResults).length > 0) {
          setEnteredResults({ ..._enteredResults });
          getAllResults().then((_results) => {
            if (Object.keys(_results).length > 0) {
              let finalResults = {};
              for (const pesel of Object.keys(_results)) {
                const peselResults = _results[pesel];
                for (const date of Object.keys(peselResults)) {
                  const peselDateResults = peselResults[date];
                  if (!_enteredResults.hasOwnProperty(pesel)) {
                    continue;
                  }
                  if (_enteredResults[pesel].includes(date)) {
                    if (!finalResults.hasOwnProperty(pesel)) {
                      finalResults[pesel] = {};
                    }
                    finalResults[pesel][date] = peselDateResults;
                  }
                }
              }
              setResults(finalResults);
              console.log(finalResults);
              setLoadingFirestore(false);
            }
          });
        }
      });
    }
  }, [user, refresh]);

  if (!firebaseLoading && user === null) {
    return (
      <div className="align-center flex flex-row items-center justify-center">
        Nie jesteś zalogowany/zalogowana.
      </div>
    );
  }

  async function removeResultAndRerender(email, pesel, date) {
    await removeResult(email, pesel, date);
    setRefresh(refresh + 1);
  }

  return (
    <div className="flex h-max w-screen flex-col items-center justify-center">
      <h1 className="my-12 font-dmser text-3xl text-pale-sky-700">
        Moje wystawione wyniki
      </h1>
      {loadingFirestore && user !== null ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center justify-center gap-6">
          {Object.keys(results).map((pesel) => (
            <>
              <p className="text-2xl flex flex-row gap-2">Wyniki wystawione dla: <p className="font-bold">{pesel}</p></p>
              <div key={pesel} className="mb-2 flex flex-row gap-2">
                {Object.keys(results[pesel]).map((date) => (
                  <ResultsCard
                    key={date}
                    pesel={pesel}
                    date={date}
                    results={results[pesel][date]}
                    removeResult={() =>
                      removeResultAndRerender(user.email, pesel, date).then(
                        () => {
                          console.log("Removed: ", user.email, pesel, date);
                        },
                      )
                    }
                  />
                ))}
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
