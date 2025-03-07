import React, { useState, useEffect } from "react";
import Header from "./Header";
import Logo from "../Assets/Logo/ADA.png";
import toast from "react-hot-toast";
import Process from "../Assets/JSON/process.json";
import Loader from "./Loader";
import BASE_URL from "../Assets/JSON/Base_Url.json";

const Profile = () => {
  const [user, setUser] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const response = await fetch(`${BASE_URL.BASE_URL}user/get-profile-details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("User Data:", data);
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
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("empID", user.empID);
      formData.append("process", user.process);
      formData.append("role", user.role);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
      const response = await fetch(`${BASE_URL.BASE_URL}user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Profile updated successfully");
      console.log("Response Data:", data);
      setUser(data.user);

      

    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

 

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      setUser({ ...user, profilePicture: e.target.files });
      console.log(e.target.files);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-[80%] h-screen mx-auto">
      <div>
        <Header />
      </div>
      <div className="p-10">
        <div className="h-[150px] w-[150px] flex justify-center items-center mx-auto rounded-full bg-orange border border-indigo-200 relative">
          {profilePicture ? (
            <img src={URL.createObjectURL(profilePicture)} alt="Profile" className="object-cover rounded-full" />
          ) : (
            <img src={user.profilePicture || Logo} alt="Profile" className="object-cover rounded-full" />
          )}
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="absolute opacity-0 cursor-pointer w-full h-full" />
          {/* <div className="absolute disable bottom-0 left-0 right-0 p-2 bg-gray-500 bg-opacity-50 text-white text-center"> Change Profile Picture </div> */}
        </div>
      </div>
      <div className="grid text-white grid-cols-2 gap-6 mb-10">
        <div className="relative">
          <input
            type="text"
            name="firstName"
            id="floating_outlined_firstName"
            className="block w-full bg-transparent text-sm h-[50px] px-4 rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer"
            placeholder="First name"
            value={user.firstName || ""}
            onChange={handleChange}
          />
          <label htmlFor="floating_outlined_firstName" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0, 0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">First name</label>
        </div>
        <div className="relative">
          <input type="text" name="lastName" id="floating_outlined_lastName" className="block w-full text-sm h-[50px] bg-transparent px-4 rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer" placeholder="Last name" value={user.lastName || ""} onChange={handleChange} />
          <label htmlFor="floating_outlined_lastName" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0, 0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Last name</label>
        </div>
        <div className="relative">
          <input type="text" name="empID" id="floating_outlined_empID" className="block w-full text-sm bg-transparent h-[50px] px-4 rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer" placeholder="Employee ID" value={user.empID || ""} onChange={handleChange} />
          <label htmlFor="floating_outlined_empID" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0, 0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Employee ID</label>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="relative">
            <select name="process" id="floating_outlined_process" className="block w-full text-sm h-[50px] bg-transparent px-4 rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer" value={user.process || ""} onChange={handleChange}>
              <option value="" disabled>Select process</option>
              {Process.map((option) => (
                <option className="bg-transparent text-black" key={option.id} value={option.name}>{option.name}</option>
              ))}
            </select>
            <label htmlFor="floating_outlined_process" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0, 0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Process</label>
          </div>
        </div>
        <div className="relative cursor-not-allowed ">
          <input type="email" name="email" id="floating_outlined_email" className="block w-full cursor-not-allowed text-sm h-[50px] px-4 rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer" placeholder="E-mail" value={user.email || ""} disabled />
          <label htmlFor="floating_outlined_email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0, 0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">E-mail</label>
        </div>
        <div className="relative">
          <input
            type="text" name="role" id="floating_outlined_role" className="block w-full cursor-not-allowed text-sm h-[50px] px-4 rounded-[8px] border border-violet-200 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500 peer" placeholder="Role" value={user.role || ""} onChange={handleChange} disabled />
          <label htmlFor="floating_outlined_role" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0, 0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Role</label>
        </div>
      </div>
      <div className="sm:flex sm:flex-row-reverse flex gap-4">
        <button className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-violet-500 hover:bg-violet-600 focus:bg-violet-700 border-violet-500 text-white focus:ring-4 focus:ring-violet-200 hover:ring-4 hover:ring-violet-100 transition-all duration-300" type="button" onClick={handleUpdate}>
          <div className="flex gap-2 items-center">Save changes</div>
        </button>
        <button className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-transparent border-primary text-primary" type="button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Profile;


