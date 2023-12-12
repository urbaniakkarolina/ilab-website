import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OfferPage from "./pages/OfferPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MapPage from "./pages/MapPage";
import ResultsPage from "./pages/ResultsPage";
import AddResultsPage from "./pages/AddResultsPage";

const PageWithNavbarAndFooter = ({ children }) => {
  return (
    <div className="flex flex-col w-screen h-screen justify-between">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PageWithNavbarAndFooter>
        <HomePage />
      </PageWithNavbarAndFooter>
    ),
  },
  {
    path: "/home",
    element: (
      <PageWithNavbarAndFooter>
        <HomePage />
      </PageWithNavbarAndFooter>
    ),
  },
  {
    path: "/login",
    element: (
      <PageWithNavbarAndFooter>
        <LoginPage />
      </PageWithNavbarAndFooter>
    ),
  },
  {
    path: "/locations",
    element: (
      <PageWithNavbarAndFooter>
        <MapPage />
      </PageWithNavbarAndFooter>
    ),
  },
  {
    path: "/offer",
    element: (
      <PageWithNavbarAndFooter>
        <OfferPage />
      </PageWithNavbarAndFooter>
    ),
  },
  {
    path: "/add-results",
    element: <PageWithNavbarAndFooter><AddResultsPage /></PageWithNavbarAndFooter>,
  },
  {
    path: "/results",
    element: (
      <PageWithNavbarAndFooter>
        <ResultsPage />
      </PageWithNavbarAndFooter>
    ),
  },
]);

export default router; 
