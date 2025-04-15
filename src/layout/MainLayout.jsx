import React, { useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../features/userSlice";

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/profile/view`, {
      withCredentials: true,
    });
    dispatch(addUser(response?.data?.data));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-700 to-gray-900 flex flex-col">
    <Header />
    <main className="flex-1 flex flex-col">
      <Outlet />
    </main>
  </div>
  );
};

export default MainLayout;
