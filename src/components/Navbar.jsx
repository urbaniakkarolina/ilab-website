import React from "react";
import NavbarButton from "./NavbarButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../firebase";

const NavbarNotLoggedIn = () => {
  return (
    <>
      <NavbarButton link="/home" text="Strona główna" />
      <NavbarButton link="/offer" text="Oferta" />
      <NavbarButton link="/locations" text="Nasze lokalizacje" />
      <NavbarButton link="/login" text="Zaloguj się" />
    </>
  );
};
const NavbarLoggedIn = () => {
  return (
    <>
      <NavbarButton link="/add-results" text="Dodaj wyniki" />
      <NavbarButton link="/results" text="Wystawione wyniki" />
      <NavbarButton link="/offer" text="Oferta" />
      <NavbarButton link="/locations" text="Nasze lokalizacje" />
      <NavbarButton link="/home" text="Wyloguj się" onClick={() => logout()} />
    </>
  );
};

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <div className="bg-smalt-blue-600 px-6 py-2 flex text-pale-sky-50 justify-between items-center p-2">
      <div>
        {user === null ? "Nie jesteś zalogowany/zalogowana" : `Zalogowano jako: ${user.email}`}
      </div>
      <div className="flex gap-2 justify-end p-2">
        {user === null ? <NavbarNotLoggedIn /> : <NavbarLoggedIn />}
      </div>
    </div>
  );
};

export default Navbar;
