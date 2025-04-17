import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  autoConnect: false,
});

export const createSocketConnection = () => {
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export default createSocketConnection;
