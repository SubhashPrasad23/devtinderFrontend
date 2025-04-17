import React from "react";
import { motion } from "framer-motion";
import { capitalized } from "../utils/Helper.jsx";

const ConnectionCard = ({ connection }) => {
  
  return (
    <motion.div
      key={connection?._id}
      className="bg-gray-800/80 w-full flex md:flex-row flex-col md:items-center justify-between  rounded-xl md:p-4 p-2 border border-gray-700 md:mb-4 mb-2"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center">
        <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden mr-4 border-2 border-purple-500/30 flex items-center justify-center bg-purple-500/10">
       { connection?.photoURL && connection?.photoURL !==""?<img src={connection?.photoURL} className="h-full w-full object-cover" alt="profile"/> : <span className="text-xl font-bold text-white/70">
            {capitalized(connection?.firstName?.charAt(0) || "U")}
          </span>}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-white">
              {capitalized(connection?.firstName)}
            </h3>
            <h3 className="font-bold text-lg text-white">
              {capitalized(connection?.lastName)}
            </h3>
          </div>
          {connection?.bio && (
            <p className="text-gray-400 text-sm mt-1">{connection?.bio}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectionCard;
