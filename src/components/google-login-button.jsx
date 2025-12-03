import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setLoading(true);
      setError("");

      try {
        // --- 1. GET GOOGLE USER INFO ---
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          },
        );

        const user = await userInfoRes.json();

        // After getting the user object from Google
        const fullName = user.name || "Guest";
        const firstName = fullName.split(" ")[0]; // <-- take only the first name

        localStorage.setItem("username", firstName);

        console.log("Google User:", user);

        // --- 2. SEND TOKEN TO BACKEND ---
        const res = await fetch(`${BACKEND_URL}/api/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenId: response.access_token }),
        });

        const data = await res.json();
        localStorage.setItem("token", data.token);

        // --- 3. NAVIGATE ---
        navigate("/");
      } catch (err) {
        console.error(err);
        setError("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setError("Login failed. Please try again.");
      setLoading(false);
    },
  });

  return (
    <div className='flex justify-center items-center h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900'>
      <div className='bg-white p-10 rounded-2xl shadow-2xl w-96 text-center transform transition-transform duration-300 hover:scale-105'>
        <div className='flex items-center gap-3 mb-2'>
          <Dumbbell className='w-8 h-8 text-red-500' />
          <h1 className='text-2xl font-bold text-violet-500'>
            Gym Workout Tracker
          </h1>
        </div>

        <p className='text-gray-500 mb-8'>
          Sign in with your Google account to continue
        </p>

        <button
          onClick={login}
          disabled={loading}
          className='flex items-center justify-center w-full bg-white border border-gray-300 hover:bg-gray-100 px-5 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-xl'
        >
          <img
            src='https://developers.google.com/identity/images/g-logo.png'
            alt='Google'
            className='w-6 h-6 mr-3'
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {error && <p className='text-red-500 mt-4'>{error}</p>}
      </div>
    </div>
  );
}
