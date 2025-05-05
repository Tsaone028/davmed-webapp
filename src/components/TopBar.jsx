import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // 🔐 Firebase logout
      navigate("/"); // 👈 Redirect to login
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="bg-white p-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard">
        <img
          src="/assets/dave_medlogo.png"
          alt="DavMed Logo"
          className="w-16 bg-white p-2 rounded"
        />
      </Link>

      <button
        onClick={handleLogout}
        className="bg-black text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default TopBar;
