import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Assets/JSON/Base_Url.json"

function RaiseTicketForm() {
  const [deskNo, setDeskNo] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  // const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("token")) {
      try {
        const response = await fetch(
          `${BASE_URL.BASE_URL}ticket/create-ticket`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ deskNo, issue, description }),
          }
        );

        const data = await response.json();

        if ((data.status = 200)) {
          toast.success(data.message);
          setSuccess("Ticket raised successfully!");
          setError(null);

          if (localStorage.getItem("user").roll === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/tickets");
          }
        } else {
          setError(data.message);
          setSuccess(null);
        }
      } catch (error) {
        toast.error(error.message);
        setError(error.message);
        setSuccess(null);
      }
    } else {
      toast.error("PLEASE LOGIN FIRST");
      navigate("/");
    }
  };

  return (



    <div className="max-w-2xl border-2 border-bottom border-indigo-500 border-2 mx-auto p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-lg text-center font-bold mb-4">Ticket Form</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 mb-4 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 mb-4 rounded-lg">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="deskNo">
            Desk No:
          </label>
          <input
            type="text"
            id="deskNo"
            value={deskNo}
            onChange={(e) => setDeskNo(e.target.value)}
            required
            className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="issue">
            Issue:
          </label>
          <input
            type="text"
            id="issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
            className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            htmlFor="description"
          >
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="bg-blue-500  mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Raise Ticket
          </button>
        </div>
      </form>
    </div>




  );
}

export default RaiseTicketForm;
