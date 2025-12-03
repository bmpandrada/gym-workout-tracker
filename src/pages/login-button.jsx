import { LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Burahin ang JWT token sa localStorage
    localStorage.removeItem("token");

    // Redirect sa login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className='flex items-center gap-2 bg-linear-to-br from-red-600 to-red-700 rounded-lg px-5 py-2 text-white cursor-pointer'
    >
      <LogOut className='w-5 h-5' />
      Logout
    </button>
  );
}
