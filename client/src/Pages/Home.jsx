import React from "react";
import ADA from "../Assets/Logo/ADA.png";
import Footer from "../Components/Footer";
import CreateTicket from "../Components/CreateTicket";
import Header from "../Components/Header";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import { Route, Routes } from "react-router-dom";
import Tickets from "../Components/Tickets";

function Home() {
  return (
    <div className="w-[80%] mx-auto md:p-2 lg:p-1 h-auto">
      <Header />

      <main className="flex justify-center items-center h-screen">
        <CreateTicket />
      </main>
    </div>
  );
}

export default Home;
