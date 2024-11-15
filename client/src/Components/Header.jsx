import React, { useState } from "react";
import { Link } from "react-router-dom";
import ADALogo from "../Assets/Logo/ADA.png";
import toast from "react-hot-toast";
import PopUpButton from "./PopUpButton";
import { CiMenuBurger } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { useEffect } from "react";


function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        setError("Error parsing user data");
      }
    }
  }, []);

  const role = user?.role;

  const handleToggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <nav className="bg-white-800 w-full mx-auto text-blue body-font border-b-4 border-indigo-500 md:flex md:justify-between md:items-center">
      <div className="flex justify-between items-center md:mb-0">
        <Link to="/" className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
          <img src={ADALogo} alt="Logo" className="h-10 w-15" />
          <span className="ml-3 text-xl">TicketMaster</span>
        </Link>
        <button
          className="md:hidden bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleToggleMobileNav}
        >
          {isMobileNavOpen ? <RxCross2 /> : <CiMenuBurger />}
        </button>
      </div>
      <div
        className={`md:block md:ml-auto md:flex md:flex-wrap md:items-center md:text-base md:justify-center ${
          isMobileNavOpen ? "block" : "hidden"
        } bg-white-800 p-4 border-t-4 border-indigo-500 md:border-none`}
      >
        {role === "user" ? (
          <Link to="/tickets" className="mr-5 hover:text-gray-200">
            Tickets
          </Link>
        ) : role === "admin" ? (
          <Link to="/admin/dashboard" className="mr-5 hover:text-gray-200">
            Dashboard
          </Link>
        ) : null}
        {localStorage.getItem("token") ? (
          <div className="mr-5 hover:text-gray-200">
            <PopUpButton />
          </div>
        ) : (
          <Link to="/login" className="mr-5 hover:text-gray-200">
            Login
          </Link>
        )}
        {localStorage.getItem("token") ? (
          <Link to="/profile" className="mr-5 hover:text-gray-200">
          Profile
        </Link>
        ) : (
          <Link to="/signup" className="hover:text-gray-200">
            Signup
          </Link>
        )}
      </div>
    </nav>
  );
}


export default Header;
