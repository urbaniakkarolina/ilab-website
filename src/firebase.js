
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDoc,
  updateDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxx",
  messagingSenderId: "xxxxxxxxxxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxxxxxxxxxxxxxx",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const userRef = await getDoc(doc(db, "users", email));
    const userData = userRef.data();
    if (userData.hasOwnProperty("user_type")) {
      return await signInWithEmailAndPassword(auth, email, password);
    } else {
      let error = new Error("User does not have staff permissions.");
      error.code = "You don't have necessary permissions to login.";
      error.name = "FirebaseError";
      throw error;
    }
  } catch (err) {
    return err;
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};


const getOffers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "new-new-bundles"));
    let offers = [];
    querySnapshot.forEach(async (doc) => {
      const docData = doc.data();
      const testDocNames = docData.tests.map((testRef) => testRef.id);
      docData.tests = testDocNames;
      offers.push({
        ...docData,
        id: doc.id,
      });
    });
    return offers;
  } catch (err) {
    console.log("Error?");
    console.error(err);
    return [];
  }
};

const getTests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tests"));
    let tests = {};
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      tests[docData.name] = docData.elements;
    });
    return tests;
  } catch (err) {
    console.error(err);
    return {};
  }
};

const getAppointments = async (date) => {
  try {
    const todaysAppointments = await getDoc(
      doc(db, "patient-appointments", date),
    );
    console.log("firebase call ended");
    return todaysAppointments.data();
  } catch (err) {
    console.error(err);
    return {};
  }
};

const getAllAppointments = async () => {
  try {
    const allAppointmentsDocs = await getDocs(
      collection(db, "patient-appointments"),
    );
    let allAppointments = {};
    allAppointmentsDocs.forEach((doc) => {
      const docData = doc.data();
      allAppointments[doc.id] = docData;
    });
    return allAppointments;
  } catch (err) {
    console.error(err);
    return {};
  }
};

const getAssistantEnteredResults = async (email) => {
  try {
    const enteredResults = await getDoc(
      doc(db, "assistant-entered-results", email),
    );
    return enteredResults.data();

  } catch (err) {
    console.error(err);
    return {};
  }
};

const getAllResults = async () => {
  try {
    const resultsDocRefs = await getDocs(collection(db, "results"));
    const resultsDocsData = {};
    for (const resultsDocRef of resultsDocRefs.docs) {
      const pesel = resultsDocRef.id;
      const patientResultsData = resultsDocRef.data();
      resultsDocsData[pesel] = patientResultsData;
    }
    return resultsDocsData;
  } catch (err) {
    console.error(err);
  }
};

const submitResults = (email, pesel, date, results) => {
  try {
    date = date.replaceAll(".", "-");

    getDoc(doc(db, "assistant-entered-results", email)).then((docRef) => {
      let docData = docRef.data();
      const patientResultDates = docData.hasOwnProperty(pesel)
        ? docData[pesel]
        : [];
      const peselAsString = `${pesel}`;
      if (patientResultDates.indexOf(date) === -1) {
        patientResultDates.push(date);
      }
      const updateData = docData;
      updateData[peselAsString] = patientResultDates;
      setDoc(doc(db, "assistant-entered-results", email), updateData);
    });

    const updateData = {};
    updateData[date] = results;
    updateDoc(doc(db, "results", pesel), updateData);
  } catch (err) {
    console.error(err);
  }
};

const removeResult = async (email, pesel, date) => {
  try {
    date = date.replaceAll(".", "-");

    const patientResultDocRef = await getDoc(doc(db, "results", pesel));
    let patientData = patientResultDocRef.data();
    delete patientData[date];

    const assistantEnteredDocRef = await getDoc(
      doc(db, "assistant-entered-results", email),
    );
    let assistantEnteredData = assistantEnteredDocRef.data();
    assistantEnteredData[pesel] = assistantEnteredData[pesel].filter(
      (item) => item !== date,
    );

    const promises = [
      setDoc(doc(db, "results", pesel), patientData),
      setDoc(doc(db, "assistant-entered-results", email), assistantEnteredData),
    ];
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getOffers,
  getTests,
  getAppointments,
  getAllAppointments,
  getAllResults,
  submitResults,
  removeResult,
  getAssistantEnteredResults,
  renameDocumentsWithDates,
};
