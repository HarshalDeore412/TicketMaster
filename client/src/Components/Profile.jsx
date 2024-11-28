import React, { useState, useEffect } from "react";
import Header from "./Header";
import Logo from "../Assets/Logo/ADA.png";
import toast from "react-hot-toast";
import Process from "../Assets/JSON/process.json";
import Loader from "./Loader";
import BASE_URL from "../Assets/JSON/Base_Url.json";

const Profile = () => {
  const [user, setUser] = useState({});
  // const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${BASE_URL.BASE_URL}user/get-profile-details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setUser(data.profile);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    toast.success("We are under maintenance");
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  if (loading)
    return (
      <div>

        <Loader />
      </div>
    );

  return (
    <div className="w-[80%] h-screen mx-auto">
      <div>
        <Header />
      </div>
      <div className="p-10">
        <div className="h-[150px] w-[150px] flex justify-center items-center mx-auto rounded-full bg-orange border border-indigo-200">
          <img src={Logo} alt="Profile" className="object-cover rounded-full" />
        </div>
      </div>
      <div className="grid text-white grid-cols-2 gap-6 mb-10">
        <div className="relative">
          <input
            type="text"
            name="firstName"
            id="floating_outlined_firstName"
            className="block w-full bg-transparent text-sm h-[50px] px-4  rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="First name"
            value={user.firstName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="relative">
          <input
            type="text"
            name="lastName"
            id="floating_outlined_lastName"
            className="block w-full text-sm h-[50px] bg-transparent px-4 rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="Last name"
            value={user.lastName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="relative">
          <input
            type="text"
            name="empID"
            id="floating_outlined_empID"
            className="block w-full text-sm bg-transparent h-[50px] px-4  rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="Employee ID"
            value={user.empID || ""}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="relative">
            <select
              name="process"
              id="floating_outlined_process"
              className="block w-full text-sm h-[50px] bg-transparent px-4  rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
              value={user.process || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select process
              </option>
              {Process.map((option) => (
                <option
                  className="bg-transparent text-black"
                  key={option.id}
                  value={option.name}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative cursor-not-allowed	 ">
          <input
            type="email"
            name="email"
            id="floating_outlined_email"
            className="block w-full cursor-not-allowed	 text-sm h-[50px] px-4  rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="E-mail"
            value={user.email || ""}
            disabled
          />
        </div>
        <div className="relative">
          <input
            type="text"
            name="role"
            id="floating_outlined_role"
            className="block w-full cursor-not-allowed	 text-sm h-[50px] px-4  rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="Role"
            value={user.role || ""}
            onChange={handleChange}
            disabled
          />
        </div>
      </div>
      <div className="sm:flex sm:flex-row-reverse flex gap-4">
        <button
          className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-violet-500 hover:bg-violet-600 focus:bg-violet-700 border-violet-500 text-white focus:ring-4 focus:ring-violet-200 hover:ring-4 hover:ring-violet-100 transition-all duration-300"
          type="button"
          onClick={handleUpdate}
        >
          <div className="flex gap-2 items-center">Save changes</div>
        </button>
        <button
          className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-transparent border-primary text-primary focus:ring-4 focus:ring-gray-100"
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Profile;
