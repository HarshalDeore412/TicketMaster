import React, { useState, useEffect } from "react";
import TicketCard from "../Components/TicketCard";
import Header from "./Header";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMyTickets = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/user/getMyTickets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data : ", data);
      setTickets(data.tickets);
      toast.success("tickets fetch successfully");
      setLoading(false);
    } catch (err) {
      setLoading(false)
      console.error(err.message);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getMyTickets();
  }, []);

  return (
    <div className="w-[80%] h-screen mx-auto">
      <div>
        <Header />
      </div>
      <div className="h-full text-center mx-auto w-[80%]">
        <h1 className="text-2xl p-4">Ticket List</h1>
        {loading ? (
          <Loader />
        ) : tickets.length === 0 ? (
          <p className="text-xl p-4">
            You don't have any tickets. But you Can Raise if you having any
            issue{" "}
          </p>
        ) : (
          <div className="flex flex-row gap-10 flex-wrap">
            {tickets.map((ticket, index) => (
              <TicketCard key={index} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tickets;
