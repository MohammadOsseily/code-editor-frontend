import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.post('http://127.0.0.1:8000/api/user/get')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className="overflow-x-auto p-4 userdiv">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="table-auto w-full shadow-md rounded-lg">
        <thead>
          <tr className="">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-4 py-2 text-center">No users available</td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <button className="bg-blue-500 text-white px-4 py-2 mr-2 rounded">Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
