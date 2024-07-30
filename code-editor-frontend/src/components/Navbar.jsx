import React, { useEffect, useState } from "react";
import "../pages/Home/styles.css";
import jwtDecode from "jwt-decode"; 

const Navebar = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role); 
    }
  }, []);

  return (
    <div className="navbar bg-primary min-h-20">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm text-2xl dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {role === "admin" ? (
              <li>
                <a href="/admin">Users</a>
              </li>
            ) : (
              <>
                <li>
                  <a href="/home">Home</a>
                </li>
                <li>
                  <a href="/submissions">Submissions</a>
                </li>
                <li>
                  <a href="/editor">Editor</a>
                </li>
              </>
            )}
          </ul>
        </div>
        <a className="btn btn-ghost text-2xl">AppName</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal text-xl px-1">
          {role === "admin" ? (
            <li>
              <a href="/admin">Users</a>
            </li>
          ) : (
            <>
              <li>
                <a href="/home">Home</a>
              </li>
              <li>
                <a href="/submissions">Submissions</a>
              </li>
              <li>
                <a href="/editor">Editor</a>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar-end flex flex-row">
        <div className="w-36 flex h-16 flex-row items-center justify-around rounded-full bg-secondary text-sm  md:h-16 md:w-44 md:text-base">
          <div className="pl-2 text-base text-white hover:text-gray-500">
            <a href={"/login"}>Login</a>
          </div>
          <div className=" ml-1 flex h-12 w-16 items-center justify-center rounded-full bg-gray-300 text-lg  hover:brightness-90 md:ml-2 md:h-12 md:w-20   md:text-base">
            <a href={"/register"}>Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navebar;
