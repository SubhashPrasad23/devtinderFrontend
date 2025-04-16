"use client"

import { useEffect, useState, useRef } from "react"
import ConnectionsList from "../components/ConnectionList"
import Chatbox from "../components/Chatbox"
import { useDispatch, useSelector } from "react-redux"
import { addConnection } from "../features/connectionSlice"
import axios from "axios"
import createSocketConnection from "../utils/socket"
import { NavLink } from "react-router-dom"
import { UserCheck } from "lucide-react"
import Loading from "../components/Loading"
import { useMobile } from "../hooks/useMobile"

const Chat = () => {
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const connections = useSelector((store) => store.connections || [])
  const loggedInUser = useSelector((store) => store.user)
  const socketRef = useRef(null)
  const isMobile = useMobile()

  const toggleMenu = () => setMenuOpen(!menuOpen)

  useEffect(() => {
    socketRef.current = createSocketConnection()
    const handleReceivedMessage = ({ firstName, text, senderId, connectionId }) => {
      if (!selectedConnection || connectionId !== selectedConnection._id) return

      setMessages((prev) => [...prev, { firstName, text, senderId }])
    }

    socketRef.current.on("receivedMessage", handleReceivedMessage)

    return () => {
      socketRef.current.off("receivedMessage", handleReceivedMessage)
      socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/connections`, {
          withCredentials: true,
        })
        dispatch(addConnection(response?.data?.data))
      } catch (error) {
        console.error("Error fetching connections", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false)
    }
  }, [isMobile])

  const handleSelectConnection = async (connection) => {
    if (!socketRef.current) return

    setSelectedConnection(connection)
    setMessages([])
    socketRef.current.emit("join", connection._id, loggedInUser._id, connection.firstName)

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chat/${connection._id}`, {
        withCredentials: true,
      })
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error("Error fetching chat messages:", error)
    }
  }

  const handleSendMessage = () => {
    if (!socketRef.current || !selectedConnection || !message.trim()) return

    const newMessage = {
      connectionId: selectedConnection._id,
      senderId: loggedInUser._id,
      firstName: loggedInUser.firstName,
      text: message,
    }

    socketRef.current.emit("sendMessage", newMessage)
    setMessages((prev) => [...prev, newMessage])
    setMessage("")
  }

  if (loading) return <Loading />

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
          <h3 className="text-xl font-bold mb-2 text-gray-600">No connections yet</h3>
          <p className="mb-6 text-gray-400">Connect with devs to start chatting!</p>
          <NavLink
            to="/app"
            className="inline-flex text-white items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-purple-500/20"
          >
            Find Developers
          </NavLink>
        </div>
      )}
    </div>
  )
}

export default Chat
