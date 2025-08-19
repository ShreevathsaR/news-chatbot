import { Socket } from "socket.io-client";

export interface Notification {
  title: string;
  url: string;
  query: string;
  userId: string;
  content?: string; 
}

export interface UseSocketReturn {
  socket: Socket | null;
  notifications: Notification[];
  clearNotifications: () => void;
}