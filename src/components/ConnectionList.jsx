import { motion } from "framer-motion"

const ConnectionsList = ({ connections, selectedId, onSelectConnection, isMobile, isOpen, toggleMenu }) => {
  return (
    <div
      className={`shrink-0 ${
        isMobile ? "absolute z-10 h-full w-full transition-all duration-300 transform" : "md:w-3/12 w-full"
      } 
      ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"} 
      bg-gray-800/50 border-r border-purple-500 flex flex-col`}
      style={{ height: isMobile ? "100%" : "auto" }}
    >
      <div className="text-xl font-bold text-white flex items-center justify-between sticky top-0 bg-gray-800 p-4 z-50">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="md:h-7 md:w-7 h-6 w-6 mr-2 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="md:m-0 ml-5">Connections</span>
        </div>
        {isMobile && (
          <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-700 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="bg-gray-900/50 flex-1 overflow-y-auto overflow-x-hidden">
        {connections.map((connection) => (
          <motion.div
            key={connection?._id}
            className={`w-full flex items-center p-2 hover:border-purple-500 hover:bg-purple-500/50 ${
              selectedId === connection?._id ? "border-purple-500 bg-purple-500/50" : "border-gray-700"
            } cursor-pointer`}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onSelectConnection(connection, connection?._id)
              if (isMobile) toggleMenu()
            }}
          >
            <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden mr-4 border-2 border-purple-500/30 flex items-center justify-center bg-purple-500/10">
              {connection?.photoURL && connection?.photoURL !== "" ? (
                <img
                  src={connection?.photoURL }
                  className="h-full w-full rounded-full"
                  alt="profile"
                />
              ) : (
                <span className="text-lg font-bold text-white/70">
                  {connection?.firstName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-white truncate">
                  {connection?.firstName.charAt(0).toUpperCase() + connection?.firstName.slice(1)}{" "}
                  {connection?.lastName.charAt(0).toUpperCase() + connection?.lastName.slice(1)}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ConnectionsList
