import React, { useState, useEffect } from "react";
import Loader from "../Loader";
import toast from "react-hot-toast";
import BASE_URL from '../../Assets/JSON/Base_Url.json'



function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  // const BASE_URL = process.env.REACT_APP_BASE_URL;


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${BASE_URL.BASE_URL}user/getUsers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          console.log("Users retrieved successfully:", data.users);
          setUsers(data.users);
          setLoading(false);
          toast.success('users fetch successfully')
        } else {
          console.error("Error retrieving users:", data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  const handleUpdate = async (_id, userData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
  
      const response = await fetch(`${BASE_URL}user/updateUser/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      console.log(response);
      setUpdateModal(false);
      window.location.reload();
      toast.success("User updated successfully!");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`${BASE_URL}user/deleteUser/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      console.log(response);
      setDeleteModal(false);
      window.location.reload();
      toast.success("User deleted successfully!");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };
  

  // const handleChangeRole = async (user) => {
  //   try {
  //     const response = await fetch(`/api/users/${user.id}/role`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify({ role: user.role }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(await response.text());
  //     }

  //     setUpdateModal(false);
  //     window.location.reload();
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  return (
    <div>
    <div className="h-screen text-center mx-auto w-[80%]">
      <h1 className="text-2xl p-4 text-indigo-500">Users List</h1>
      {loading ? (
        <Loader />
      ) : (
        <table className="table-auto border w-full text-left">
          <thead className="bg-indigo-100 text-indigo-500">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-indigo-200 hover:bg-indigo-50"
                style={{
                  animation: `fadeIn 0.5s ease-in-out ${index * 0.2}s forwards`,
                  opacity: 0,
                }}
              >
                <td className="px-3 py-2">{user.empID}</td>
                <td className="px-3 py-2">{` ${user.firstName}  ${user.lastName} `}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2 flex justify-around">
                  <button
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setSelectedUser(user);
                      setUpdateModal(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setSelectedUser(user);
                      setDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    {updateModal && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 ease-in-out">
    <div className="bg-white rounded-lg shadow-xl p-8 w-3/4 max-w-lg">
      <h2 className="text-2xl text-center font-bold mb-6">Update User</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(selectedUser);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Name:</label>
          <input
            type="text"
            value={selectedUser.name}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
            className="block w-full rounded-lg border border-gray-300 p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Role:</label>
          <select
            value={selectedUser.role}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, role: e.target.value })
            }
            className="block w-full rounded-lg border border-gray-300 p-3 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform duration-200 transform hover:scale-105"
          >
            Update
          </button>
          <button
            onClick={() => setUpdateModal(false)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform duration-200 transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

  
    {deleteModal && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-1/2">
          <h2 className="text-2xl font-bold mb-4">Delete User</h2>
          <p className="text-lg mb-4">
            Are you sure you want to delete {selectedUser.name}?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => handleDelete(selectedUser._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteModal(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  
  );
}

export default Users;
