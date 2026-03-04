import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only connect if user is authenticated
    if (userData?._id) {
      const newSocket = io("http://localhost:4000"); // Backend URL
      setSocket(newSocket);

      newSocket.emit("join", userData._id);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userData]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
