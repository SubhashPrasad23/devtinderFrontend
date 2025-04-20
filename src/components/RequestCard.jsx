import { Check, X } from 'lucide-react'
import React from 'react'
import { capitalized } from '../utils/Helper'
import { motion } from "framer-motion";

const RequestCard = ({request,onClick}) => {
  return (
    <motion.div
    key={request._id}
    className="bg-gray-800/80 w-full flex  md:items-center  rounded-xl p-4 border border-gray-700 mb-4"
    initial={{ y: 0, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
  >
   
      <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden mr-4 border-2 border-purple-500/30 flex items-center justify-center bg-purple-500/10">
      {request?.fromUserId.photoURL && request?.fromUserId.photoURL !==""?<img src={request.fromUserId.photoURL} className="h-full w-full object-cover rounded-full" alt="profile"/>  :<span className="text-xl font-bold text-white/70">
          {capitalized(
            request?.fromUserId?.firstName?.charAt(0) || "U"
          )}
        </span>}
      </div>


      <div className="w-full flex md:flex-row flex-col md:items-center justify-between gap-2">
      <div className=''>
        <div className="flex items-center  gap-2">
          <h3 className="font-bold text-lg text-white">
            {capitalized(request?.fromUserId?.firstName)}
          </h3>
          <h3 className="font-bold text-lg text-white">
            {capitalized(request?.fromUserId?.lastName)}
          </h3>
        </div>
        <p className="text-gray-400 text-sm">Connection Request</p>
        <p className="text-gray-500 text-xs">
          Sent on {new Date(request.createdAt).toLocaleDateString()}
        </p>
      </div>
   

    <div className="flex items-center  gap-2">
      <motion.button
        onClick={() => onClick(request._id, "rejected")}
        className="py-1.5 px-3 bg-red-700/50 hover:bg-red-700 border border-red-600/30 rounded-lg text-red-300 hover:text-white text-sm font-medium transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <X className="w-4 h-4 inline-block mr-1" />
        Decline
      </motion.button>

      <motion.button
        onClick={() => onClick(request._id, "accepted")}
        className="py-1.5 px-3 bg-green-700/50 hover:bg-green-700 border border-green-500/30 rounded-lg text-green-200 hover:text-white text-sm font-medium transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Check className="w-4 h-4 inline-block mr-1" />
        Accept
      </motion.button>
    </div>
    </div>
  </motion.div>
  )
}

export default RequestCard
