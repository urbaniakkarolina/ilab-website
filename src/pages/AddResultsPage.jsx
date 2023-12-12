import React, { useReducer, useEffect, useState, useLayoutEffect } from "react";
import {
  auth,
  getTests,
  getAllAppointments,
  getAssistantEnteredResults,
  submitResults,
} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import LoadingSpinner from "../components/LoadingSpinner";

const MILISECONDS_IN_SECONDS = 1000;
const SECONDS_IN_HOUR = 3600;
const HOURS_IN_DAY = 24;

function getDateWithOffset(offsetInDays) {
  const offsetInMiliseconds =
    offsetInDays * HOURS_IN_DAY * SECONDS_IN_HOUR * MILISECONDS_IN_SECONDS;
  const timeNow = new Date().getTime();
  const date = new Date(timeNow + offsetInMiliseconds);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

const AddResultsPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [loadingFirestore, setLoadingFirestore] = useState(true);
  const [tests, setTests] = useState({});
  const [enteredResults, setEnteredResults] = useState({});
  const [allAppointments, setAllAppointments] = useState({});
  const [appointments, setAppointments] = useState({});
  const [index, setIndex] = useState();
  const [dayOffset, setDayOffset] = useState(0);
  let today = getDateWithOffset(dayOffset);
  console.log(enteredResults);

  let elementsInTests = {}; // wszystkie substancje
  let selectedPesel = "";
  let testNames = [];

  if (
    index !== undefined && //index to numer peselu danego dnia
    index !== -1 && //jak sie zatwierdza wyniki, to ustawiamy index na 1
    Object.keys(appointments).length > 0
  ) {
    selectedPesel = Object.keys(appointments)[index];
    Object.values(appointments)[index].map((test) => {
      elementsInTests = { ...elementsInTests, ...tests[test] }; //slownik gdzie key: nazwa subst, wartość: zakres prawidlowy i jednostka
    });
    testNames = Object.values(appointments)[index]; // wyciagam jedno z nazw badan
  } else {
    selectedPesel = "";
    elementsInTests = {};
    testNames = [];
  }

  const setDateOneDayIntoPast = () => {
    setDayOffset(dayOffset - 1);
  };
  const setDateOneDayIntoFuture = () => {
    setDayOffset(dayOffset + 1);
  };
  const resetDayOffset = () => {
    setDayOffset(0);
  };

  useEffect(() => {
    console.log("runnig layout effect");
    setLoadingFirestore(true);
    if (user !== null) {
      getTests().then((_tests) => {
        console.log("getting tests");
        getAllAppointments().then((_allAppointments) => {
          console.log("getting appointments");
          setTests({ ..._tests });

          let _allAppointmentsDots = {};
          for (const dateWithDash of Object.keys(_allAppointments)) {
            const dateWithDots = dateWithDash.replaceAll("-", ".");
            _allAppointmentsDots[dateWithDots] = _allAppointments[dateWithDash];
          }
          setAllAppointments({ ..._allAppointmentsDots });
        });
      });
    }
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      getAssistantEnteredResults(user.email).then((_enteredResults) => {
        console.log("getting entered results");
        for (const pesel of Object.keys(_enteredResults)) {
          let datesWithDots = [];
          _enteredResults[pesel].forEach((dateWithDashes) =>
            datesWithDots.push(dateWithDashes.replaceAll("-", ".")),
          );
          _enteredResults[pesel] = datesWithDots;
        }
        setEnteredResults({ ..._enteredResults });
        setLoadingFirestore(false);
      });
    }
  }, [allAppointments]);

  useEffect(() => {
    console.log("update update update");
    console.log(index);
    const _enteredResults = enteredResults;
    setEnteredResults({});
    setEnteredResults({ ..._enteredResults });
  }, [index]);

  useEffect(() => {
    setIndex(-1);
    today = getDateWithOffset(dayOffset);
  }, [dayOffset]);

  useEffect(() => {
    console.log("Setting appointments for day: ", today);
    if (Object.keys(allAppointments).length > 0) {
      if (allAppointments[today] !== undefined) {
        setAppointments(allAppointments[today]);
      } else {
        setAppointments({});
      }
    } else {
      if (user !== null) {
        user.reload();
      }
      setAppointments({});
    }
  }, [today, allAppointments]);

  if (error !== undefined) {
    console.error(error);
  }

  if (!loading && user === null) {
    return (
      <div className="align-center flex flex-row items-center justify-center">
        Nie jesteś zalogowany/zalogowana.
      </div>
    );
  }

  return (
    <div className="flex h-max w-screen flex-col items-center pt-6">
      <div className="flex w-full flex-row items-center justify-evenly">
        <button className="text-2xl" onClick={setDateOneDayIntoPast}>
          &lt;
        </button>
        <p
          className="text-3xl hover:cursor-pointer font-dmser text-pale-sky-700"
          onClick={resetDayOffset}
        >
          {today}
        </p>
        <button className="text-2xl" onClick={setDateOneDayIntoFuture}>
          &gt;
        </button>
      </div>
      <div className="flex h-max w-3/4 flex-row justify-stretch p-8">
        <div className="min-h-[500px] w-1/4 rounded-l-xl border border-black bg-gray-100 p-10">
          {loadingFirestore ? (
            <LoadingSpinner />
          ) : (
            <Accordion
              allowToggle
              index={index}
              onChange={(expandedIndex) => setIndex(expandedIndex)}
            >
              {Object.keys(appointments).length === 0
                ? "Brak badań tego dnia."
                : Object.keys(appointments).map((pesel) => (
                  <AccordionItem
                    key={pesel}
                    isDisabled={enteredResults[pesel].includes(today)}
                  >
                    {({ isExpanded }) => {
                      return (
                        <>
                          <AccordionButton
                            className={
                              isExpanded && index !== undefined
                                ? "mb-2 flex flex-row justify-between border-b font-bold"
                                : "mb-2 flex flex-row justify-between border-b"
                            }
                          >
                            <div className="flex flex-row gap-1">
                              <div
                                className={
                                  enteredResults[pesel].includes(today)
                                    ? "line-through"
                                    : ""
                                }
                              >
                                {pesel}
                              </div>
                              {enteredResults[pesel].includes(today)
                                ? " - już zapisano"
                                : ""}
                            </div>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel className="pb-4">
                            {appointments[pesel].map((test, idx) => (
                              <p key={idx}>- {test}</p>
                            ))}
                          </AccordionPanel>
                        </>
                      );
                    }}
                  </AccordionItem>
                ))}
            </Accordion>
          )}
        </div>

        <div className="flex w-3/4 flex-col rounded-r-xl border border-black px-20 pt-10">
          {user !== null && (
            <ElementsForm
              email={user.email}
              date={today}
              pesel={selectedPesel}
              testNames={testNames}
              elementsInTests={elementsInTests}
              dayOffset={dayOffset}
              index={index}
              setIndex={setIndex}
              enteredResults={enteredResults}
              setEnteredResults={setEnteredResults}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ElementsForm = ({
  email,
  date,
  pesel,
  testNames,
  elementsInTests,
  dayOffset,
  index,
  setIndex,
  enteredResults,
  setEnteredResults,
  updateView,
}) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useLayoutEffect(() => {
    setErrorMsg("");
    setSuccess("");
  }, [dayOffset, index]);

  if (Object.keys(elementsInTests).length === 0) {
    return (
      <div className="flex h-max flex-row items-center justify-center">
        Nie wybrano żadnego pacjenta.
      </div>
    );
  }

  return (
    <>
      {Object.keys(elementsInTests).map((element) => {
        const elementInfo = elementsInTests[element];
        const rangeText = `${elementInfo.range_start} - ${elementInfo.range_end} ${elementInfo.unit}`;
        return (
          <div key={element} className="mb-2 min-w-max border border-black p-2">
            <div className="flex flex-row justify-between">
              <p className="font-bold">{element}</p>
              <input
                type="text"
                inputMode="numeric"
                placeholder={rangeText}
                id={element}
                className="rounded-md border border-black text-center"
              />
            </div>
          </div>
        );
      })}
      <div className="w-fill flex min-h-fit flex-col items-center justify-center pt-4">
        {errorMsg === "" ? (
          success === true ? (
            <div className="min-h-fit pt-4">
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Sukces!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  Wysłano dane do bazy.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            ""
          )
        ) : (
          <div className="min-h-fit pt-4">
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Błędy w formularzu:
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                <pre>{errorMsg}</pre>
              </AlertDescription>
            </Alert>
          </div>
        )}
        <button
          className="m-8 max-w-xs rounded-lg border hover:bg-old-rose-300 transition-all border-pale-sky-400 bg-old-rose-400 px-4 py-2"
          onClick={() => {
            let errors = collectValidateAndSendData(
              email,
              pesel,
              date,
              testNames,
              elementsInTests,
            );
            let errorMsg = "";
            if (errors !== undefined) {
              Object.keys(errors).map((errorElement) => {
                errorMsg += `${errorElement}: ${errors[errorElement]}\n`;
              });
            }
            setErrorMsg(errorMsg);
            setSuccess(errorMsg === "");

            if (errorMsg === "") {
              setTimeout(() => {
                setIndex(-1);
                let _enteredResults = enteredResults;
                let resultsForPesel = enteredResults.hasOwnProperty(pesel)
                  ? enteredResults[pesel]
                  : [];
                resultsForPesel.push(date);
                _enteredResults[pesel] = resultsForPesel;
                setEnteredResults({ ..._enteredResults });
              }, 5000);
            } else {
              setTimeout(() => {
                setEnteredResults({ ...enteredResults });
                setErrorMsg("");
                setSuccess(false);
                setIndex(index);
              }, 5000);
            }
          }}
        >
          Zatwierdź
        </button>
      </div>
    </>
  );
};

const collectValidateAndSendData = (
  email,
  pesel,
  date,
  testNames,
  elementsInTests,
) => {
  let values = {};
  let errors = {};
  for (const elementName of Object.keys(elementsInTests)) {
    const inputForElement = parseFloat(
      document.getElementById(elementName).value,
    );
    const error = validate(inputForElement);
    if (error === "") {
      values[elementName] = inputForElement;
    } else {
      errors[elementName] = error;
    }
  }

  if (Object.keys(errors).length > 0) {
    console.log(errors);
    return errors;
  }

  const results = {
    ...values,
    name: testNames.join(", "),
    test_names: testNames,
  };
  submitResults(email, pesel, date.replaceAll(".", "-"), results);
};

const validate = (value) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "Wartość nie jest liczbą";
  }
  if (value < 0.0) {
    return "Wartość jest ujemna";
  }
  return "";
};

export default AddResultsPage;
