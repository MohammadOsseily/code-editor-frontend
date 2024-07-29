import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://127.0.0.1:8000/api/user/get")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleEditButton = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDeleteButton = (userId) => {
    if (
      window.confirm(
        `Are you sure you want to delete the user with ID ${userId}?`
      )
    ) {
      axios
        .post(`http://127.0.0.1:8000/api/user/delete/${userId}`)
        .then((response) => {
          if (response.data === "User deleted" || response.status === 200) {
            setUsers(users.filter((user) => user.id !== userId));
          } else {
            alert("Failed to delete user. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert("An error occurred while deleting the user. Please try again.");
        });
    }
  };

  return (
    <div className="bg-secondary h-screen">
      <div className="p-4 userdiv">
        <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>
        <table className="table-auto w-full rounded-lg userdiv">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left"></th>
              <th className="px-4 py-2 text-left text-white">Name</th>
              <th className="px-4 py-2 text-left text-white">Email</th>
              <th className="px-4 py-2 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center">
                  No users available
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2 text-white">{index + 1}</td>
                  <td className="px-4 py-2 text-white">{user.name}</td>
                  <td className="px-4 py-2 text-white">{user.email}</td>
                  <td className="px-4 py-2 text-white">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                      onClick={() => handleEditButton(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDeleteButton(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
