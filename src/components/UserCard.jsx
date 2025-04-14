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
    handleSendRequest(direction === "left" ? "ignored" : "interested", id);
  };

  const handleSendRequest = async (status, id) => {
    try {
      await axios.post(
        `http://localhost:7000/request/send/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(id));
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };
  console.log(data);
  return (
    <TinderCard
      onSwipe={(dir) => handleSwipe(dir, data._id)}
      className="absolute top-0 left-0 w-full h-full "
      swipeRequirementType="position"
      swipeThreshold={100}
      preventSwipe={["up", "down"]}
    >
      <motion.div
        className="w-full h-full rounded-2xl  overflow-hidden border-2  relative bg-gray-400 shadow-[4px_4px_0px_gray]  border-b border-purple-500/30 "
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-red-300 flex-1 h-full w-full">
          {data?.photoURL ? (
            <img src={data?.photoURL} alt="Profile" className="" />
          ) : (
            <img src={noImage} alt="No_Image" className="object-cover" />
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 z-10 bg-black">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {capitalized(data?.firstName)} {capitalized(data?.lastName)}
              </h2>

              <div className=" gap-4 mb-3">
                {data.skills.some(skill => skill.trim() !== "") && (
                  <div className="flex items-center text-gray-300">
                    <Code className="w-4 h-4 mr-1" />
                    {data?.skills &&
                      data?.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center mr-2 mb-1"
                        >
                          <span className="text-sm ">{capitalized(skill)}</span>
                        </div>
                      ))}
                  </div>
                )}

                {data?.yearOfExperience  && (
                  <div className="flex items-center text-gray-300">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <div className="text-sm flex items-center gap-1">
                      <span>{data.yearOfExperience}</span>
                      <span>
                        {data.yearOfExperience > 1
                          ? "years of experience"
                          : "year of experience"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="">
            <p className="text-gray-200">
              {data.bio ? capitalized(data?.bio) : ""}
            </p>
          </div>

          <div className="mt-4 flex justify-between">
            <div className="text-sm text-gray-400">← Swipe left to skip</div>
            <div className="text-sm text-gray-400">
              Swipe right to connect →
            </div>
          </div>
        </div>
      </motion.div>
    </TinderCard>
  );
};

export default UserCard;
