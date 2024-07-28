import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditUser.css';

const EditUser = () => {
  const { id } = useParams(); 
  const [user, setUser] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`http://127.0.0.1:8000/api/user/getone/${id}`)
      .then(response => {
        if (response.data) {
          setUser(response.data);
        } else {
          alert('Failed to fetch user data. Please try again.');
        }
      })
      .catch(error => console.error('Error fetching user:', error));
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    console.log('Updating user:', user);
  
    axios.post(`http://127.0.0.1:8000/api/user/update/${id}`, user)
      .then(response => {
        console.log('Response:', response.data);
        if (response.data.status === 'success') {
          navigate('/admin'); 
        } else {
          alert('Failed to update user. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error updating user:', error);
        if (error.response) {
          console.error('Error data:', error.response.data);
          alert('Error: ' + error.response.data.message);
        } else {
          alert('An error occurred while updating the user. Please try again.');
        }
      });
  };
  
  
  const handleCancel = () => {
    navigate('/admin'); 
  };

  return (
    <div className="edit-user-container p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form className="edit-user-form">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
