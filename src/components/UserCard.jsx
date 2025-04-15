"use client"

import { Briefcase, Code } from "lucide-react"
import { motion } from "framer-motion"
import TinderCard from "react-tinder-card"
import { capitalized } from "../utils/Helper"
import axios from "axios"
import { useDispatch } from "react-redux"
import { removeUserFromFeed } from "../features/feedSlice"
import noImage from "../assets/image/noImage.png"

const UserCard = ({ data }) => {
  const dispatch = useDispatch()

  const handleSwipe = (direction, id) => {
    console.log(direction)
    handleSendRequest(direction === "left" ? "ignored" : "interested", id)
  }

  const handleSendRequest = async (status, id) => {
    try {
      console.log(status, id)
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/request/send/${status}/${id}`,
        {},
        { withCredentials: true }
      )
      console.log(res)
      dispatch(removeUserFromFeed(id))
    } catch (error) {
      console.error("Error sending request:", error)
    }
  }

  return (
    <TinderCard
      onSwipe={(dir) => handleSwipe(dir, data._id)}
      className="absolute top-0 left-0 w-full h-full"
      swipeRequirementType="position"
      swipeThreshold={100}
      preventSwipe={["up", "down"]}
    >
      <motion.div
        className="w-[90%] sm:w-[85%] md:w-[80%]  mx-auto shadow-[7px_5px_0px_gray]  rounded-2xl overflow-hidden  border border-purple-500/20 bg-gradient-to-br from-gray-900 via-black to-gray-900 h-[450px] md:h-[500px] flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Image */}
        <div className="h-80 w-full">
          {data?.photoURL ? (
            <img src={data?.photoURL} alt="Profile" className="h-full w-full " />
          ) : (
            <img src={noImage} alt="No_Image" className="h-full w-full object-cover" />
          )}
        </div>

        {/* Card Content */}
        <div className="w-full p-2 ">
          <div className="flex justify-between items-start">
            <div>
              {/* User Name */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                {capitalized(data?.firstName)} {capitalized(data?.lastName)}
              </h2>

              {/* Skills */}
              {data.skills.some((skill) => skill.trim() !== "") && (
                <div className="flex flex-wrap items-center text-gray-300 mb-1">
                  <Code className="w-4 h-4 mr-1 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                    {data?.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-gray-800/70 px-2 py-0.5 rounded-full">
                        {capitalized(skill)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {data?.yearOfExperience && (
                <div className="flex items-center text-gray-300">
                  <Briefcase className="w-4 h-4 mr-1 flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span>{data.yearOfExperience}</span>
                    <span className="ml-1">
                      {data.yearOfExperience > 1 ? "years of experience" : "year of experience"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {data.bio && (
            <p className="text-sm text-gray-200 mt-2 line-clamp-3 leading-relaxed overflow-hidden">
              {capitalized(data?.bio)}
            </p>
          )}

          {/* Swipe Instructions */}
          <div className="w-full mt-4 flex md:justify-between">
            <div className="md:text-sm text-xs text-gray-400">Swipe left to skip</div>
            <div className="md:text-sm text-xs text-gray-400">Swipe right to connect</div>
          </div>
        </div>
      </motion.div>
    </TinderCard>
  )
}

export default UserCard
