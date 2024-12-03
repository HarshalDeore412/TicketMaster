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
<nav className=" p-4 border-1 border-b border-r border-red-500  w-full shadow-md">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <Link to="/" className="flex items-center text-white">
      <img src={ADALogo} alt="TicketMaster" className="h-12 w-auto" />
      <span className="ml-3 text-2xl font-semibold">
        {localStorage.getItem("user")
          ? `Hi, ${user.firstName?.charAt(0).toUpperCase() + user.firstName?.slice(1).toLowerCase()}`
          : ""}
      </span>
    </Link>
    <div className="hidden md:flex space-x-6 items-center">
      {role === "user" && (
        <Link to="/tickets" className="flex items-center text-white hover:text-gray-300 transition duration-300">
          Tickets <IoTicketOutline className="ml-1" />
        </Link>
      )}
      {role === "admin" && (
        <Link to="/admin/dashboard" className="flex items-center bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-transparent hover:text-white border border-white transition duration-300">
          Dashboard <RxDashboard className="ml-2" />
        </Link>
      )}
      {localStorage.getItem("token") ? (
        <PopUpButton className="mr-4 text-white" />
      ) : (
        <Link to="/login" className="text-white hover:text-gray-300 transition duration-300">
          Login
        </Link>
      )}
      {localStorage.getItem("token") ? (
        <Link to="/profile" className="flex items-center text-white text-2xl hover:text-gray-300 transition duration-300">
          <CgProfile className="text-2xl" />
        </Link>
      ) : (
        <Link to="/signup" className="text-white hover:text-gray-300 transition duration-300">
          Signup
        </Link>
      )}
    </div>
    <button
      className="md:hidden bg-white text-indigo-600 p-2 rounded focus:outline-none"
      onClick={handleToggleMobileNav}
    >
      {isMobileNavOpen ? <RxCross2 className="text-2xl" /> : <CiMenuBurger className="text-2xl" />}
    </button>
  </div>
  {isMobileNavOpen && (
    <div className="md:hidden mt-4 space-y-4 text-center">
      {role === "user" && (
        <Link to="/tickets" className="block text-white hover:text-gray-300 transition duration-300">
          Tickets <IoTicketOutline className="ml-1 inline-block" />
        </Link>
      )}
      {role === "admin" && (
        <Link to="/admin/dashboard" className="block bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-transparent hover:text-white border border-white transition duration-300">
          Dashboard <RxDashboard className="ml-2 inline-block" />
        </Link>
      )}
      {localStorage.getItem("token") ? (
        <PopUpButton className="block text-white" />
      ) : (
        <Link to="/login" className="block text-white hover:text-gray-300 transition duration-300">
          Login
        </Link>
      )}
      {localStorage.getItem("token") ? (
        <Link to="/profile" className="block text-white hover:text-gray-300 transition duration-300">
          <CgProfile className="h-10   text-black inline-block" />
        </Link>
      ) : (
        <Link to="/signup" className="block text-white hover:text-gray-300 transition duration-300">
          Signup
        </Link>
      )}
    </div>
  )}
</nav>


  );
}

export default Header;
