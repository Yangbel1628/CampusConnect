/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token, user }     = useAuth();
  const socketRef           = useRef(null);
  const [onlineUsers, setOnlineUsers]           = useState([]);
  const [notifications, setNotifications]       = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect",    () => console.log("🟢 Socket connected"));
    socket.on("disconnect", () => console.log("🔴 Socket disconnected"));

    socket.on("user_online",  ({ userId }) =>
      setOnlineUsers((prev) => [...new Set([...prev, userId])])
    );
    socket.on("user_offline", ({ userId }) =>
      setOnlineUsers((prev) => prev.filter((id) => id !== userId))
    );

    socket.on("new_notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadNotifCount((c) => c + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const joinConversation  = (id) => socketRef.current?.emit("join_conversation", id);
  const leaveConversation = (id) => socketRef.current?.emit("leave_conversation", id);
  const sendTyping        = (convId) =>
    socketRef.current?.emit("typing", { conversationId: convId, userId: user?._id });
  const stopTyping        = (convId) =>
    socketRef.current?.emit("stop_typing", { conversationId: convId, userId: user?._id });

  const onMessage = (cb) => {
    socketRef.current?.on("new_message", cb);
    return () => socketRef.current?.off("new_message", cb);
  };

  const resetNotifCount = () => setUnreadNotifCount(0);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef,
        onlineUsers,
        notifications,
        unreadNotifCount,
        resetNotifCount,
        joinConversation,
        leaveConversation,
        sendTyping,
        stopTyping,
        onMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);