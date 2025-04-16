"use client";

import { Briefcase, Code } from "lucide-react";
import { motion } from "framer-motion";
import TinderCard from "react-tinder-card";
import { capitalized } from "../utils/Helper";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../features/feedSlice";
import noImage from "../assets/image/noImage.png";

const UserCard = ({ data }) => {
  const dispatch = useDispatch();

  const handleSwipe = (direction, id) => {
    console.log(direction);
    handleSendRequest(direction === "left" ? "ignored" : "interested", id);
  };

  const handleSendRequest = async (status, id) => {
    try {
      console.log(status, id);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/request/send/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      console.log(res);
      dispatch(removeUserFromFeed(id));
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <TinderCard
      onSwipe={(dir) => handleSwipe(dir, data._id)}
      className="absolute top-0 left-0 w-full h-full"
      swipeRequirementType="position"
      swipeThreshold={100}
      preventSwipe={["up", "down"]}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-sm mx-auto bg-black overflow-hidden shadow-[3px_3px_7px_2px_rgba(147,_51,_234,_0.5)] rounded-2xl h-[500px] flex flex-col"
      >
        <div className="h-72 w-full flex-shrink-0">
          {data?.photoURL ? (
            <img
              src={data?.photoURL}
              alt="Profile"
              className="h-full w-full rounded-b-lg"
            />
          ) : (
            <img
              src={noImage}
              alt="No_Image"
              className="h-full w-full rounded-b-lg"
            />
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            {capitalized(data?.firstName)} {capitalized(data?.lastName)}
          </h2>

          <div className="flex-grow overflow-auto">
            {data.skills &&
              data.skills.some((skill) => skill.trim() !== "") && (
                <div className="flex flex-wrap gap-1  ">
                  {data?.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-800/70 px-3 py-1 rounded-full mb-1"
                    >
                      {capitalized(skill)}
                    </span>
                  ))}
                </div>
              )}

            {data?.yearOfExperience && (
              <div className=" text-gray-300 mb-2 text-xs sm:text-sm">
                <span>{data.yearOfExperience}</span>
                <span className="ml-1">
                  {data.yearOfExperience > 1
                    ? "years of experience"
                    : "year of experience"}
                </span>
              </div>
            )}

            {data.bio && (
              <p className="text-sm text-gray-200 mt-2 leading-relaxed overflow-auto max-h-24">
                {capitalized(data?.bio)}
              </p>
            )}
          </div>

          <div className="w-full mt-4 flex justify-between pt-2 border-t border-gray-800">
            <div className="md:text-sm text-xs text-gray-400">
              Swipe left to skip
            </div>
            <div className="md:text-sm text-xs text-gray-400">
              Swipe right to connect
            </div>
          </div>
        </div>
      </motion.div>
    </TinderCard>
  );
};

export default UserCard;
