import React, { useState, useEffect } from "react";
import TicketCard from "../Components/TicketCard";
import Header from "./Header";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [totalTickets, setTotalTickets] = useState(0);

  const getMyTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized access");
      }

      const response = await fetch(
        `http://localhost:4000/api/user/getMyTickets?page=${currentPage}&limit=${ticketsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        if(response.status === 404){
          throw new Error(`You Dont Have Tickets`)
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      <div className=" mx-auto w-[80%]">
        <h1 className="text-2xl text-center p-4">Ticket List</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-xl p-4">{error}</p>
        ) : tickets && tickets.length > 0 ? (
         
            <div className="flex  w-[100%] h-screen flex-wrap overflow-y-auto">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  className="w-1/3 p-2"
                />
              ))}
            
            <div className="w-full">
              <div className="flex justify-between h-10 pt-10 bottom-5">
                {/* Items per page */}
                <div className="gap-2">
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
          <p className="text-xl p-4">
            You don't have any tickets. But you can raise one if you're having
            any issues.
          </p>
        )}
      </div>
    </div>
  );
}

export default Tickets;
