import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { MdDownload } from "react-icons/md";
import { FaLessThan } from "react-icons/fa";
import { FaGreaterThan } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmationPopup from "./ConfirmationPopup";

import BASE_URL from '../../Assets/JSON/Base_Url.json'

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [totalTickets, setTotalTickets] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    empID: "",
  });

  // const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchTickets();
  }, [currentPage, filters, ticketsPerPage ]  );

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage,
        limit: ticketsPerPage,
        ...filters,
      }).toString();

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL.BASE_URL}ticket/get-all-tickets?${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
        setTotalTickets(data.pagination.totalCount);
        toast.success("Tickets data fetched successfully");
      } else {
        if (response.status === 404) {
          toast.error(`No ${filters.status} tickets found`);
        }

        setTickets([]);
        setTotalTickets(0);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      toast.error(error.message)

    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, ticketsPerPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to the first page when filters change
  };

  const handleUpdate = (ticket) => {
    setSelectedTicket(ticket);
    setModalIsOpen(true);
  };

  const updateTicket = async (ticket) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL.BASE_URL}ticket/update-ticket/${ticket._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ticket }),
        }
      );

      if (response.status === 404) {
        toast.success(` No ${filters.status} Tickets `);
      }

      if (response.ok) {
        toast.success("Ticket updated successfully");
        setModalIsOpen(false);
        fetchTickets();
      } else {
        toast.error("Failed to update ticket");
      }
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  const handleDeleteById = async (id) => {
    try {
      // Ask for user confirmation
      const userConfirmed = window.confirm("Are you sure you want to delete this?");
      if (userConfirmed) {
        console.log("Confirmed! Executing delete function...");
  
        // Fetch request to delete the item
        const response = await fetch(
          `${BASE_URL.BASE_URL}ticket/delete-ticket/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you need to send a token for authentication
            },
          }
        );
  
        console.log(response.status);
  
        if (response.ok) {
          toast.success("Ticket Deleted Successfully");
          
        } else {
          console.error("Failed to delete the item");
          toast.error("Failed to delete the item");
        }
      }
    } catch (error) {
      console.error("Error deleting the item:", error);
      toast.error("Error deleting the item");
    }
  };
  

  const downloadReport = async () => {
    try {
      const query = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status,
        empID: filters.empID,
      }).toString();

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:4000/api/ticket/download-report?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("download report respose ", response);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tickets_report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalTickets / ticketsPerPage); i++) {
    pageNumbers.push(i);
  }

  function handleTicketsPerPageChange(e) {
    setTicketsPerPage(parseInt(e.target.value));
  }

  return (
    <div className="h-full flex animate-fade-down animate-once animate-duration-1000 animate-delay-100 animate-ease-in justify-center">
      <div className="h-full w-[100%] pt-2 text-center mx-auto">
        <div className="h-full flex justify-center">
          <div className="h-full w-[100%] pt-2 text-center mx-auto">
            <div className="filters flex flex-col md:flex-row items-center justify-around bg-indigo-500 text-white p-1 rounded-lg shadow-lg mb-2">
              <input
                type="text"
                name="empID"
                placeholder="Filter by Employee ID"
                value={filters.empID}
                onChange={handleFilterChange}
                className="filter-input bg-white text-gray-800 rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 shadow-md"
              />
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="filter-select bg-white text-gray-800 rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 shadow-md"
              >
                <option value=""> All </option>
                <option value="Open">Open</option>
                <option value="Processing">Processing</option>
                <option value="Closed">Closed</option>
              </select>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="filter-input bg-white text-gray-800 rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 shadow-md"
              />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="filter-input bg-white text-gray-800 rounded-lg px-4 py-2 mb-2 md:mb-0 shadow-md"
              />
              <button
                onClick={downloadReport}
                className="bg-green-500 flex justify-center items-center hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                <span className="mr-2">Download</span>
                <MdDownload className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="w-screen flex justiy-center items-center" > {<Loader />} </div>
        ) : (
          <div className="overflow-x-auto w-full h-screen mx-auto p-2  ">
            <table className="table-auto border w-full text-left">
              <thead className="bg-indigo-500 text-white">
                <tr>
                  <th className="px-4 py-2">Desk No</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Emp ID</th>
                  <th className="px-4 py-2">Issue</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                  <td className="px-4 py-2  text-xl text-white-800 ">
                    <MdDeleteOutline />
                  </td>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                    style={{
                      animation: `fadeIn 0.5s ease-in-out ${
                        index * 0.2
                      }s forwards`,
                      opacity: 0,
                    }}
                  >
                    <td className="px-4 py-2">{ticket.deskNo}</td>
                    <td className="px-4 py-2">{ticket.name}</td>
                    <td className="px-4 py-2">{ticket.empID}</td>
                    <td className="px-4 py-2">{ticket.issue}</td>
                    <td className="px-4 py-2">{ticket.description}</td>
                    <td className="px-4 py-2">
                      {ticket.status === "Open" ? (
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                          onClick={() => handleUpdate(ticket)}
                        >
                          Open
                        </button>
                      ) : ticket.status === "Processing" ? (
                        <button
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
                          onClick={() => handleUpdate(ticket)}
                        >
                          Processing
                        </button>
                      ) : (
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                          onClick={() => handleUpdate(ticket)}
                        >
                          Closed
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(ticket.dateTime).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(ticket.dateTime).toLocaleTimeString("default", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2 text-xl text-red-800">
                      <MdDeleteOutline
                        onClick={() => handleDeleteById(ticket._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination flex justify-between items-center px-10 mt-4 space-x-2">
              <div>
                <select
                  value={ticketsPerPage}
                  onChange={handleTicketsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  className="page-number px-3 py-1 rounded-md border bg-white text-indigo-500 border-gray-300 hover:bg-indigo-700 hover:text-white focus:outline-none"
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="page-number px-3 py-1 rounded-md border bg-white text-indigo-500 border-gray-300 hover:bg-indigo-700 hover:text-white focus:outline-none"
                  disabled={currentPage === 1}
                >
                  <FaLessThan />
                </button>
                {pageNumbers
                  .slice(
                    Math.max(currentPage - 3, 0),
                    Math.min(currentPage + 2, pageNumbers.length)
                  )
                  .map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`page-number px-3 py-1 rounded-md border ${
                        currentPage === number
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "bg-white text-indigo-500 border-gray-300"
                      } hover:bg-indigo-700 hover:text-white focus:outline-none`}
                    >
                      {number}
                    </button>
                  ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pageNumbers.length)
                    )
                  }
                  className="page-number px-3 py-1 rounded-md border bg-white text-indigo-500 border-gray-300 hover:bg-indigo-700 hover:text-white focus:outline-none"
                  disabled={currentPage === pageNumbers.length}
                >
                  <FaGreaterThan />
                </button>
                <button
                  onClick={() => setCurrentPage(pageNumbers.length)}
                  className="page-number px-3 py-1 rounded-md border bg-white text-indigo-500 border-gray-300 hover:bg-indigo-700 hover:text-white focus:outline-none"
                  disabled={currentPage === pageNumbers.length}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "600px",
              padding: "20px",
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl text-center border-b-2 pb-4 border-indigo-500 font-bold text-gray-800 mb-6">
              Update Ticket
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateTicket(selectedTicket);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue:
                </label>
                <input
                  type="text"
                  value={selectedTicket?.issue || ""}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      issue: e.target.value,
                    })
                  }
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                </label>
                <textarea
                  value={selectedTicket?.description || ""}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      description: e.target.value,
                    })
                  }
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status:
                </label>
                <select
                  value={selectedTicket?.status || ""}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      status: e.target.value,
                    })
                  }
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                >
                  <option value="Open">Open</option>
                  <option value="Processing">Processing</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note:
                </label>
                <textarea
                  value={selectedTicket?.Note || ""}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      Note: e.target.value,
                    })
                  }
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                />
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="inline-flex w-[50%] justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Ticket
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminTickets;
