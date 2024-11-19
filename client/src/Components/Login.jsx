import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "./Header";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passVisible, setPassVisible] = useState(false);

  function ToggleVisible() {
    if (passVisible) {
      setPassVisible(false);
    } else {
      setPassVisible(true);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4000/api/user/user-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data.User));
      console.log("DATA --> ", data);

      if (data.success === true) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className=" w-[80%] mx-auto ">
      <div>
        <Header />
      </div>

      <div className=" flex justify-center items-center h-screen ">
        <div className="max-w-md p-4 md:p-6 lg:p-8 bg-white border-y-4 border-indigo-500  rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Login</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 mb-4 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password:
              </label>
              <div className="flex justify-between items-center ">
                <input
                  type={passVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <div onClick={ToggleVisible} className="ml-2">
                  {passVisible ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
