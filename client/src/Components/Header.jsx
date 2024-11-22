import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ADALogo from "../Assets/Logo/ADA.png";
import toast from "react-hot-toast";
import PopUpButton from "./PopUpButton";
import { CiMenuBurger } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";
import { IoTicketOutline } from "react-icons/io5";


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
    <nav className="bg-white p-2 w-full mx-auto text-blue body-font border-b-4 border-indigo-500 md:flex md:justify-between md:items-center shadow-md">
      <div className="flex justify-between items-center md:mb-0 p-4 md:p-0">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex title-font font-medium items-center text-indigo-600 mb-4 md:mb-0">
            <img src={ADALogo} alt="TicketMaster" className="h-10 w-15" />
          </Link>
          <p className="text-2xl font-semibold text-indigo-600 animate-fadeInUp">
            {localStorage.getItem("user") ? `Hi ${user.firstName}` : ""}
          </p>
        </div>
        <button
          className="md:hidden bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          onClick={handleToggleMobileNav}
        >
          {isMobileNavOpen ? <RxCross2 className="text-2xl" /> : <CiMenuBurger className="text-2xl" />}
        </button>
      </div>
      <div
        className={`md:flex md:ml-auto md:items-center md:text-base md:justify-center ${isMobileNavOpen ? "block" : "hidden"} bg-white w-full md:w-auto p-4 md:p-0 border-t-4 border-indigo-500 md:border-none transition duration-300 ease-in-out`}
      >
        {role === "user" ? (
          <Link to="/tickets" className="mr-5 text-xl flex justify-center items-center gap-2 hover:text-gray-400 text-indigo-600 transition duration-300 ease-in-out">
            <p>Tickets</p> <IoTicketOutline />
          </Link>
        ) : role === "admin" ? (
          <Link to="/admin/dashboard" className="mr-5 border-2 border-indigo-500 p-2 flex items-center space-x-2 text-lg font-semibold text-indigo-600 hover:text-indigo-400 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg shadow-md hover:shadow-lg">
            <span>Dashboard</span>
            <RxDashboard className="text-2xl" />
          </Link>
        ) : null}
        {localStorage.getItem("token") ? (
          <div className="mr-5">
            <PopUpButton />

          </div>
        ) : (
          <Link to="/login" className="mr-5 hover:text-gray-400 text-indigo-600 transition duration-300 ease-in-out">
            Login
          </Link>
        )}
        {localStorage.getItem("token") ? (
          <Link to="/profile" className="mr-1 flex items-center space-x-2 text-lg font-semibold text-indigo-600 hover:text-indigo-400 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg shadow-md hover:shadow-lg">
            <CgProfile className="text-indigo-500 text-5xl" />
          </Link>
        ) : (
          <Link to="/signup" className="hover:text-gray-400 text-indigo-600 transition duration-300 ease-in-out">
            Signup
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;
