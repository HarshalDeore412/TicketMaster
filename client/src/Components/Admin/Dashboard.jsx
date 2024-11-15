import React, { useState, useEffect } from "react";
import Header from "../Header";
import Loader from "../Loader";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import Users from "./Users";

Modal.setAppElement("#root");

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState({});
  const [toggle, setToggle] = useState("user");

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token") || null;
      const response = await fetch(
        "http://localhost:4000/api/ticket/get-all-tickets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Tickets data:", data.tickets);

      setTickets(data.tickets);
      toast.success("Tickets fetched successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error.message);
      toast.error(error.message);
    }
  };

  const updateTicket = async (ticket) => {
    try {
      console.log("Ticket : ", ticket);
      const response = await fetch(
        `http://localhost:4000/api/ticket/update-ticket/${ticket._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(ticket),
        }
      );

      // if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      // }

      const data = await response.json();
      console.log("DATA  : : ", data);
      console.log(data.message);
      toast(data.message);
      setTickets(tickets.map((t) => (t._id === ticket._id ? ticket : t)));
      toast.success("Ticket updated successfully");
      setModalIsOpen(false);
    } catch (err) {
      // console.error(err.message);
      toast.error(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      //   weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdate = (ticket) => {
    setSelectedTicket(ticket);
    setModalIsOpen(true);
  };

  return (
    <div className=" w-[80%] mx-auto">
      <Header />
      <div className=" mx-auto pt-5 flex justify-center">
      <div className="flex items-center">
        <button 
          className={`${toggle ? "bg-indigo-700" : "bg-indigo-500"} w-[100%] text-white font-bold py-2 px-4 rounded-l-lg`}
          onClick={() => setToggle(false)}
        >
          Users
        </button>
        <button 
          className={`${toggle ? "bg-indigo-500" : "bg-indigo-700"} w-[100%] text-white font-bold py-2 px-4 rounded-r-lg`}
          onClick={() => setToggle(true)}
        >
          Tickets
        </button>
      </div>
    </div>


      {toggle ? (
        <div className=" h-full flex justify-centers ">
          <div className="h-full text-center mx-auto">
            <h1 className="text-2xl p-4">Ticket List</h1>
            {loading ? (
              <Loader />
            ) : (  
              <div className="overflow-x-auto w-[80%] mx-auto p-10">
                <table className="table-auto w-full text-left">
                  <thead className="bg-indigo-500 text-white">
                    <tr>
                      <th className="px-4 py-2">Desk No</th>
                      <th className="px-4 py-2">Issue</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="px-4 py-2">{ticket.deskNo}</td>
                        <td className="px-4 py-2">{ticket.issue}</td>
                        <td className="px-4 py-2">{ticket.description}</td>
                        <td className="px-4 py-2">
                          {ticket.status === "Open" ? (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                              Open
                            </button>
                          ) : ticket.status === "Processing" ? (
                            <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg">
                              Processing
                            </button>
                          ) : (
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                              Closed
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {formatDate(ticket.dateTime)}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => handleUpdate(ticket)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
                width: "80%",
                maxWidth: "500px",
                padding: "20px",
                border: "none",
                borderRadius: "10px",
              },
            }}
          >
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-2xl text-center border-b-4 pb-5 border-indigo-500 font-bold text-gray-800 mb-4">
                Update Ticket
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateTicket(selectedTicket);
                }}
                className="space-y-4 "
              >
                <div className="flex justify-between  items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Issue:
                  </label>
                  <input
                    type="text"
                    value={selectedTicket.issue}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        issue: e.target.value,
                      })
                    }
                    className="mt-1 block w-[80%] border-b-2 border-indigo-500  shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Description:
                  </label>
                  <input
                    type="text"
                    value={selectedTicket.description}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-[80%] border-b-2 border-indigo-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        status: e.target.value,
                      })
                    }
                    className="mt-1 block w-[80%] pl-3 py-2 border-b-2 border-indigo-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="open">Open</option>
                    <option value="Processing">Processing</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <p>Note : </p>
                  <input
                    type="text"
                    value={selectedTicket.Note}
                    onChange={(e) =>
                      setSelectedTicket({
                        ...selectedTicket,
                        Note: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="inline-flex w-[50%]  justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update Ticket
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      ) : (
        <div className="w-[80%] h-full mx-auto ">
          {<Users />}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
