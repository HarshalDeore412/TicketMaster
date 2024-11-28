import React, { useState, useEffect } from "react";
import TicketCard from "../Components/TicketCard";
import Header from "./Header";
import Loader from "./Loader";
import { toast } from "react-hot-toast";
import BASE_URL from "../Assets/JSON/Base_Url.json";
import { IoTicketOutline } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [totalTickets, setTotalTickets] = useState(0);
  const navigate = useNavigate()
  // const BASE_URL = process.env.REACT_APP_BASE_URL;

  const getMyTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized access");
      }

      const response = await fetch(
        `${BASE_URL.BASE_URL}user/getMyTickets?page=${currentPage}&limit=${ticketsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setTickets(data.data);
        setTotalTickets(data.pagination.totalCount);
        toast.success("Tickets fetched successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyTickets();
  }, [currentPage, ticketsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTicketsPerPageChange = (e) => {
    setTicketsPerPage(parseInt(e.target.value));
  };

  return (
    <div className="w-[80%] h-full mx-auto">
      <div>
        <Header />
      </div>
      <div className=" h-screen mx-auto w-[80%]">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-xl p-4">{error}</p>
        ) : tickets && tickets.length > 0 ? (
          <div className="flex  w-[100%] h-screen flex-wrap overflow-y-auto">
            <h1 className="text-2xl text-center p-4">Ticket List</h1>
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                className="w-1/3 p-2"
              />
            ))}

            <div className="w-full bg-transparent text-white">
              <div className="flex  justify-between h-10 pt-10 bottom-5">
                {/* Items per page */}
                <div className="gap-2 bg-transparent text-black ">
                  <select
                    value={ticketsPerPage}
                    onChange={handleTicketsPerPageChange}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>

                {/* Page numbers */}
                <div className="">
                  <ul className="flex space-x-2">
                    {[...Array(Math.ceil(totalTickets / ticketsPerPage))].map(
                      (_, index) => (
                        <li key={index + 1}>
                          <button
                            onClick={() => handlePageChange(index + 1)}
                            className={
                              currentPage === index + 1
                                ? "bg-blue-500 flex justify-center text-white px-4 py-2 rounded-lg"
                                : "px-4 py-2 flex justify-center rounded-lg hover:bg-gray-200"
                            }
                          >
                            {index + 1}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid h-screen place-content-top mt-36 bg-transparent px-4">
            <div className="text-center ">
              <div className="flex flex-col" >
                <div className="mx-auto text-9xl " > <IoTicketOutline /> </div>
                <h1 className="text-7xl font-black  text-shadow shadow-cyan-500/50 text-gray-200">
                  No Tickets Available
                </h1>
              </div>

              <div
                onClick={() => { navigate('/')}}
                className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
              >
                Create Ticket
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tickets;
