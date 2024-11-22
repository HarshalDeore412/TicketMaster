import React, { useState, useEffect } from "react";
import Header from "../Header";
import Modal from "react-modal";
import Users from "./Users";
import AdminTicket from "./AdminTickets"
import BASE_URL from '../../Assets/JSON/Base_Url.json'
Modal.setAppElement("#root");

function Dashboard() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState("user");


 
  return (
    <div className=" animate-once animate-ease-linear w-[80%] mx-auto">
      <Header />
      <div className=" mx-auto pt-5 flex justify-center">
        <div className="flex items-center">
          <button
            className={`${
              toggle ? "bg-indigo-700" : "bg-indigo-500"
            } w-[100%] text-white font-bold py-2 px-4 rounded-l-lg`}
            onClick={() => setToggle(false)}
          >
            Users
          </button>
          <button
            className={`${
              toggle ? "bg-indigo-500" : "bg-indigo-700"
            } w-[100%] text-white font-bold py-2 px-4 rounded-r-lg`}
            onClick={() => setToggle(true)}
          >
            Tickets
          </button>
        </div>
      </div>

      {toggle ? (
        <div className="w-full mx-auto ">{<AdminTicket />}</div>
      ) : (
        <div className="w-full h-full mx-auto ">{<Users />}</div>
      )}
    </div>
  );
}

export default Dashboard;
