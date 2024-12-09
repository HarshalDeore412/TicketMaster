import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Assets/JSON/Base_Url.json";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { CiSquareRemove } from "react-icons/ci";
import { FaLeaf } from "react-icons/fa";
import Loader from "./Loader";

function RaiseTicketForm() {
  const [deskNo, setDeskNo] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (!deskNo || !issue || !description) {
      setError("Please fill in all fields");

      setLoading(false)
      return;

    }

    if (localStorage.getItem("token")) {
      try {
        const formData = new FormData();
        formData.append("deskNo", deskNo);
        formData.append("issue", issue);
        formData.append("description", description);
        formData.append("image", image);

        const response = await fetch(
          `${BASE_URL.BASE_URL}ticket/create-ticket`,
          {
            method: "POST",
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();

        if (data.success) {
          toast.success(data.message);
          setSuccess("Ticket raised successfully!");
          setError(null);
          setLoading(false)
          if (JSON.parse(localStorage.getItem("user")).role === "admin") {
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
        setLoading(false)
      }
    } else {
      toast.error("PLEASE LOGIN FIRST");
      navigate("/");
    }
  };

  const handleUnselect = () => {
    setImage(null);
  };

  return (
    <div className="max-w-2xl rounded-md bg-indigo-700 shadow-[25px_15px_0px_0px_rgba(70,70,70)] mx-auto p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl text-center font-bold mb-4">Ticket Form</h2>
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
      {
        loading ? ( <div className="w-full h-screen flex justify-center items-center" >   <Loader />  </div> ) : (<form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap">
            <label className="block text-sm font-medium mb-2" htmlFor="deskNo">
              Desk No
            </label>
            <input
              type="text"
              id="deskNo"
              value={deskNo}
              onChange={(e) => setDeskNo(e.target.value)}
              required
              placeholder="Enter your desk number"
              className="block bg-transparent w-full p-2 text-sm text-white-500  border-b border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-wrap">
            <label className="block text-sm font-medium mb-2" htmlFor="issue">
              Issue
            </label>
            <input
              type="text"
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
              placeholder="Describe the issue"
              className="block w-full p-2 text-sm bg-transparent text-white-500  border-b border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-wrap">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Provide a detailed description"
              className="block w-full bg-transparent p-2 text-sm text-white-700  border-b border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
            />
          </div>

          <div className="">
            <label
              htmlFor="image"
              className=" text-base px-5 py-3 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
            >
              <AiOutlineCloudUpload className="w-6 mr-2 fill-white inline" />
              Upload
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </label>
            {image && (
              <div className="flex justify-between border-b border-r p-2 items-center gap-10 " >
                <p>Selected file: {image.name.slice(0, 7)}</p>
                <button
                  onClick={handleUnselect}
                  className="text-red-500 text-xl rounded-md"
                ><CiSquareRemove />
                </button>{" "}
              </div>
            )}
          </div>
  
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Raise Ticket
            </button>
          </div>
        </form>) 
      }
    </div>
  );
}

export default RaiseTicketForm;
