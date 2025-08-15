import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "@/hooks/useAuthContext";

// Define the context type
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// Create context with default values
export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Provider component
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuthContext();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }
    if (socket) {
      if (!socket.connected) {
        socket.connect();
        setIsConnected(true);
      }
      console.log(socket);
      console.warn("Socket already initialized");
      return;
    }

    // Initialize socket connection
    const token = localStorage.getItem("access_token");

    if (!token) return;

    const socketInstance = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      path: "/socket.io/",
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      timeout: 10000,
    });

    setSocket(socketInstance);

    // Clean up
    return () => {
      socketInstance.disconnect();
      setIsConnected(false);
    };
  }, [user, socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
