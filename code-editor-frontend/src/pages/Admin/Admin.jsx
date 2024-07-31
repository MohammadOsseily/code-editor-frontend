import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [reload, setReload] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://127.0.0.1:8000/api/user/get")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setUsers([]);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [reload]);

  const handleEditButton = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDeleteButton = (userId) => {
    setUserToDelete(userId);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) {
      console.error("No user selected for deletion.");
      return;
    }

    axios
      .post(`http://127.0.0.1:8000/api/user/delete/${userToDelete}`)
      .then((response) => {
        if (response.data === "User deleted" || response.status === 200) {
          setUsers(users.filter((user) => user.id !== userToDelete));
          setShowConfirmation(false);
          setUserToDelete(null);
        } else {
          alert("Failed to delete user. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting the user. Please try again.");
      });
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setUserToDelete(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImportData = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://127.0.0.1:8000/api/import-users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected data format after import:", response.data);
          setUsers([]);
        }
        setReload((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error importing data:", error);
        alert("An error occurred while importing data. Please try again.");
      });
  };

  return (
    <div className="bg-secondary mt-4 h-screen">
      <div className="p-4 userdiv mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>
          <div>
            <input type="file" onChange={handleFileChange} />
            <button
              className="btn btn-outline btn-info ml-2"
              onClick={handleImportData}
            >
              Import Data
            </button>
          </div>
        </div>
        {showConfirmation && (
          <div role="alert" className="alert bg-success mt-5 mb-5">
            <span>Are you sure you want to delete this user?</span>
            <div
              className="flex justify-end mt-4"
              style={{ width: "fit-content", marginLeft: "auto" }}
            >
              <button
                className="btn btn-sm mr-2 bg-neutral"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button className="btn btn-sm btn-error" onClick={confirmDelete}>
                Confirm
              </button>
            </div>
          </div>
        )}
        <table className="table-auto w-full rounded-lg userdiv">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left"></th>
              <th className="px-4 py-2 text-left text-white">Name</th>
              <th className="px-4 py-2 text-left text-white">Email</th>
              <th className="pr-24 py-2 text-left flex justify-end  text-white">
                Actions
              </th>
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
                  <td className="px-4 py-2 flex justify-end text-white">
                    <button
                      className="btn btn-outline btn-info px-4 py-2 mr-2 rounded"
                      onClick={() => handleEditButton(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline btn-error text-white px-4 py-2 rounded"
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
