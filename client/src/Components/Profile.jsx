import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Logo from "../Assets/Logo/ADA.png";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/user/get-profile-details",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data);
        console.log(response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {

    toast.success("we  are under maintenace")

    e.preventDefault();
    try {
      await axios.put("http://localhost:4000/api/user/update-profile", user);
      setUserData(user);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading...</div>;

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

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="relative">
          <input
            type="text"
            name="firstName"
            id="floating_outlined_firstName"
            className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="First name"
            value={user.firstName || ""}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_outlined_firstName"
            className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem]"
          >
            First name
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            name="lastName"
            id="floating_outlined_lastName"
            className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="Last name"
            value={user.lastName || ""}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_outlined_lastName"
            className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem]"
          >
            Last name
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            name="jobTitle"
            id="floating_outlined_jobTitle"
            className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="Job title"
            value={user.jobTitle || ""}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_outlined_jobTitle"
            className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem]"
          >
            Job title
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            name="companyName"
            id="floating_outlined_companyName"
            className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="Company name"
            value={user.companyName || ""}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_outlined_companyName"
            className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem]"
          >
            Company name
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            name="email"
            id="floating_outlined_email"
            className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="E-mail"
            value={user.email || ""}
            disabled
          />
          <label
            htmlFor="floating_outlined_email"
            className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem]"
          >
            E-mail
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            name="phone"
            id="floating_outlined_phone"
            className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="Phone"
            value={user.phone || ""}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_outlined_phone"
            className="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem]"
          >
            Phone
          </label>
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
          onClick={() => setEditing(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Profile;
