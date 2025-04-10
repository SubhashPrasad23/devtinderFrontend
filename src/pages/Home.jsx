import axios from "axios";
import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { addFeed } from "../features/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import noDataFound from "../assets/lottie/noDataFound.json";
import Loading from "../components/Loading";
import Lottie from "lottie-react";

const Body = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.feed);

  const fetchFeed = async () => {
    try {
      const response = await axios.get("http://localhost:7000/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response?.data?.users));
      console.log(response?.data?.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

 

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
      {userData?.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center text-white">
          <div className="w-40">
            <Lottie animationData={noDataFound} />
          </div>
          <h2 className="text-gray-600 text-2xl font-bold">
            No New Users Found!
          </h2>
        </div>
      ) : (
        <div className="relative w-full max-w-sm md:h-[500px] h-[400px] place-content-center">
          {userData.map((user) => (
            <UserCard key={user._id} data={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Body;
