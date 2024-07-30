import React, { useEffect, useState } from "react";
import "./CodeSubmissions.css";
import { IoIosDownload } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const EmptyComponent = () => {
  return <div className="empty-space"></div>;
};

const CodeSubmissions = () => {
  const [codes, setCodes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState(null);
  const Navigate = useNavigate();

  const handlecreate = () =>{
    Navigate('/editor')
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      axios
        .get(`http://127.0.0.1:8000/api/code_submission/${userId}`)
        .then((response) => {
          console.log("Fetched codes:", response.data.codes);
          setCodes(response.data.codes);
        })
        .catch((error) => {
          console.error("Error fetching user codes:", error);
        });
    }
  }, []);

  const handleDownload = (code, filename) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDelete = (codeId) => {
    console.log(`Attempting to delete code with ID: ${codeId}`);
    setCodeToDelete(codeId);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (!codeToDelete) {
      console.error("No code selected for deletion.");
      return;
    }

    console.log(`Deleting code with ID: ${codeToDelete}`);

    axios
      .delete(`http://127.0.0.1:8000/api/code_submission/${codeToDelete}`)
      .then((response) => {
        setCodes(codes.filter((code) => code.id !== codeToDelete));
        setShowConfirmation(false);
        setCodeToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting code:", error);
      });
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setCodeToDelete(null);
  };

  return (
    <div className="bg-secondary h-screen">
      <EmptyComponent />
      <div className="flex justify-between items-center full-width">
        <h2 className="m-5 text-2xl text-white">Codes</h2>
        <button className="btn btn-outline btn-success m-3 ml-auto mr-20 mt-5" onClick={handlecreate}>
          Create
        </button>
      </div>
      {showConfirmation && (
        <div role="alert" className="alert bg-success mb-5 size mx-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info h-6 w-6 shrink-0 secondary-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Are you sure you want to delete this code?</span>
          <div>
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
      <div className="flex">
        {codes.length > 0 ? (
          codes.map((codeData, index) => (
            <div
              key={index}
              className="card bg-gray-300 w-96 shadow-xl ml-10 mb-4"
            >
              <div className="card-body">
                <h2 className="card-title">{codeData.name}'s Code</h2>
                <pre className="card-text">{codeData.code}</pre>
                <div className="card-actions justify-end">
                  <IoIosDownload
                    className="icon download-icon"
                    onClick={() =>
                      handleDownload(codeData.code, `${codeData.name}_code.txt`)
                    }
                  />
                  <MdDelete
                    className="icon delete-icon"
                    onClick={() => handleDelete(codeData.id)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="m-5 text-white">No code submissions found.</div>
        )}
      </div>
    </div>
  );
};

export default CodeSubmissions;
