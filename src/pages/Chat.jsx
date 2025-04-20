import { useEffect, useState } from "react";
import ConnectionsList from "../components/ConnectionList";
import Chatbox from "../components/Chatbox";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../features/connectionSlice";
import axios from "axios";
import createSocketConnection from "../utils/socket";
import { NavLink } from "react-router-dom";
import { UserCheck } from "lucide-react";
import Loading from "../components/Loading";
import { useMobile } from "../hooks/useMobile";

const Chat = () => {
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections || []);
  const loggedInUser = useSelector((store) => store.user);
  const isMobile = useMobile();
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const socket = createSocketConnection();
    setSocket(socket);

    socket.on("receivedMessage", ({ firstName, text, senderId }) => {
      if (senderId !== loggedInUser._id) {
        setMessages((prev) => [...prev, { firstName, text, senderId }]);
      }
    });

    return () => {
      socket.off("receivedMessage");
      socket.disconnect();
    };
  }, [loggedInUser?._id]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/connections`,
          {
            withCredentials: true,
          }
        );
        dispatch(addConnection(response?.data?.data));
      } catch (error) {
        console.error("Error fetching connections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const handleSelectConnection = async (connection) => {
    if (!socket) return;

    setSelectedConnection(connection);
    setMessages([]);

    socket.emit(
      "join",
      connection?._id,
      loggedInUser?._id,
      connection?.firstName
    );

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/chat/${connection._id}`,
        {
          withCredentials: true,
        }
      );
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (!socket || !selectedConnection || !message.trim()) return;

    const newMessage = {
      connectionId: selectedConnection._id,
      senderId: loggedInUser._id,
      firstName: loggedInUser.firstName,
      text: message,
    };
    setMessages((prev) => [...prev, newMessage]);

    setMessage("");
    socket.emit("sendMessage", newMessage);
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full flex flex-col md:flex-row md:h-[calc(100vh-90px)] h-[calc(100vh-70px)] overflow-hidden border border-gray-700 relative mobile-chat-container">
      {connections.length > 0 ? (
        <>
          <ConnectionsList
            connections={connections}
            selectedId={selectedConnection?._id}
            onSelectConnection={handleSelectConnection}
            isMobile={isMobile}
            isOpen={menuOpen}
            toggleMenu={toggleMenu}
          />
          <Chatbox
            selectedConnection={selectedConnection}
            messages={messages}
            onSendMessage={handleSendMessage}
            message={message}
            onChange={setMessage}
            isMobile={isMobile}
            toggleMenu={toggleMenu}
          />
        </>
      ) : (
        <div className="h-full w-full flex flex-1 flex-col items-center justify-center">
          <UserCheck className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-600">
            No connections yet
          </h3>
          <p className="mb-6 text-gray-400">
            Connect with devs to start chatting!
          </p>
          <NavLink
            to="/app"
            className="inline-flex text-white items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-purple-500/20"
          >
            Find Developers
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Chat;
