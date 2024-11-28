import React from "react";
import ADA from "../Assets/Logo/ADA.png";
import Footer from "../Components/Footer";
import CreateTicket from "../Components/CreateTicket";
import Header from "../Components/Header";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import { Route, Routes, useNavigate } from "react-router-dom";
import Tickets from "../Components/Tickets";
import logo from "../Assets/Logo/ADA.png";
import { Navigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-[80%] mx-auto md:p-2 lg:p-1 h-auto">
  <Header />

  <main className="flex justify-center items-center mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    {localStorage.getItem("token") ? (
      <CreateTicket />
    ) : (
      <section className="">
        <div className=" bg-opacity-90 p-8 rounded-lg shadow-lg">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl text-white">
              Welcome To ADA Tech
              <strong className="font-extrabold text-yellow-300 sm:block">
                Helpdesk
              </strong>
            </h1>

            <p className="mt-4 sm:text-xl text-gray-200">
              If you are experiencing any technical issues, please click the
              button below to submit a support ticket.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="block w-full rounded bg-yellow-400 px-12 py-3 text-sm font-medium text-indigo-800 shadow hover:bg-yellow-500 focus:outline-none focus:ring active:bg-yellow-600 sm:w-auto"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      </section>
    )}
  </main>
</div>

  );
}

export default Home;
