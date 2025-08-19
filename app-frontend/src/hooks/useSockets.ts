import api from '@/lib/api';
import { Notification, UseSocketReturn } from '@/lib/types/notification';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: number | null): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // const SERVER_URL = 'https://news-chatbot-j7rc.onrender.com';
  const SERVER_URL = 'http://localhost:5000';

  useEffect(() => {
    if (!userId) return;

    getNotifications()

    const newSocket = io(SERVER_URL, {
      transports: ['websocket'],
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('authenticate', userId);
    });

    newSocket.on('new_article', (data: Notification) => {

      console.log('New article notification received:', data);

      setNotifications((prev) => [...prev, data]);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect');
      newSocket.off('new_article');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, [userId]);

  const clearNotifications = () => setNotifications([]);

  const getNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        console.log('Fetched notifications:', response.data.data);
        setNotifications((prev) => [...prev, response.data.data]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return { socket, notifications, clearNotifications };
};