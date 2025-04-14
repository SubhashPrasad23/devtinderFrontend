// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:7000", {
  autoConnect: false,
});

export const createSocketConnection = () => {
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export default createSocketConnection;
