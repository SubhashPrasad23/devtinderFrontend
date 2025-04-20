import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Send, Menu } from "lucide-react";

const ChatBox = ({
  selectedConnection,
  messages,
  message,
  onChange,
  onSendMessage,
  isMobile,
  toggleMenu,
}) => {
  const loggedInUser = useSelector((store) => store?.user);
  const scrollRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  if (!selectedConnection) {
    return (
      <div className="flex-1 w-full bg-gray-900 flex flex-col items-center justify-center p-8 text-center">
        {isMobile && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
          </div>
        )}
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-600/20 flex items-center justify-center border-2 border-purple-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Start a Conversation
          </h3>
          <p className="text-gray-400 mb-6">
            {isMobile
              ? "Tap the menu button to select a connection"
              : "Select a connection from the list to begin chatting"}
          </p>
          {!isMobile && (
            <motion.div
              className="text-purple-500 text-sm"
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            >
              ← Click on a connection
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 flex flex-col h-full">
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center">
        {isMobile && (
          <button
            onClick={toggleMenu}
            className="p-2 mr-2 rounded-full hover:bg-gray-700"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
        )}
        <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden mr-3 border-2 border-purple-500/30 flex items-center justify-center bg-purple-500/10">
          {selectedConnection?.photoURL &&
          selectedConnection?.photoURL !== "" ? (
            <img
              src={selectedConnection.photoURL}
              className="h-full w-full "
              alt="profile"
            />
          ) : (
            <span className="text-sm font-bold text-white/70">
              {selectedConnection.firstName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 overflow-hidden">
          <h3 className="font-bold text-white truncate">
            {selectedConnection.firstName.charAt(0).toUpperCase() +
              selectedConnection.firstName.slice(1)}{" "}
            {selectedConnection.lastName.charAt(0).toUpperCase() +
              selectedConnection.lastName.slice(1)}
          </h3>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto hideScrollbar bg-gray-900/50"
        style={{
          height: "calc(100% - 128px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 flex ${
                msg?.senderId === loggedInUser?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg  ${
                  msg?.senderId === loggedInUser?._id
                    ? "bg-purple-600 text-white rounded-tr-none"
                    : "bg-gray-700 text-gray-100 rounded-tl-none"
                }`}
              >
                <p className="break-words">{msg.text}</p>
                {/* <span className="text-xs opacity-70 mt-1 block text-right">{msg.time}</span> */}
              </div>
            </div>
          ))}

          <div ref={scrollRef} />
        </AnimatePresence>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-700 bg-gray-800/80 sticky bottom-0 left-0 right-0"
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="flex-1 bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600"
            whileFocus={{ borderColor: "rgba(147, 51, 234, 0.5)" }}
          >
            <textarea
              value={message}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-transparent text-white p-3 outline-none resize-none h-12 max-h-32 overflow-y-auto overflow-x-hidden"
              style={{ minHeight: "48px" }}
              onKeyDown={handleKeyPress}
            />
          </motion.div>
          <motion.button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full h-12 w-12 flex items-center justify-center cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
