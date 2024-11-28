import React, { useState, useEffect } from "react";
import Header from "../Header";
import Modal from "react-modal";
import Users from "./Users";
import AdminTicket from "./AdminTickets"
import BASE_URL from '../../Assets/JSON/Base_Url.json'
import { CiImageOn } from "react-icons/ci";



Modal.setAppElement("#root");

function Dashboard() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState("user");


 
  return (
<div className="w-full max-w-7xl mx-auto p-4">
  <Header />
  <div className="flex justify-center py-5"> 
  <div className="flex items-center"> 
    <button 
      className={`${!toggle ? "bg-yellow-200 " : "bg-transparent border-1 border-l border-r border-yellow-300  "} w-1/2 m-1 text-black font-bold py-2 px-4 rounded-lg focus:outline-none  focus:ring-indigo-100`}
      onClick={() => setToggle(false)}
    > 
      Users 
    </button> 
    <button 
      className={`${toggle ? "bg-yellow-200 " : "bg-transparent border-1 border-l border-r border-yellow-300  "} w-1/2 m-1 text-black font-bold py-2 px-4 rounded-lg focus:outline-none  focus:ring-indigo-100`}
      onClick={() => setToggle(true)}
    > 
      Tickets 
    </button> 
  </div> 
</div>


  {toggle ? (
    <div className="w-full">{<AdminTicket />}</div>
  ) : (
    <div className="w-full h-full">{<Users />}</div>
  )}
</div>

  );
}

export default Dashboard;
