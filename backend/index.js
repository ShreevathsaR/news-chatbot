import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newsRoutes from "./routes/newsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import axios from "axios";
import { Server } from "socket.io";
import { createServer } from "http";
import redis from "./lib/redis.js";
import { clearOldNotifications } from "./utils/sendNotifications.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chatbot.vathsa.site",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

app.use("/api", newsRoutes, queryRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.send("API IS RUNNING");
});

let activeUsers = {};
let socketToUser = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("authenticate", (userId) => {
    const previousUserId = socketToUser[socket.id];
    if (previousUserId && activeUsers[previousUserId] === socket.id) {
      delete activeUsers[previousUserId];
    }
    
    activeUsers[userId] = socket.id;
    socketToUser[socket.id] = userId;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    const userId = socketToUser[socket.id];
    if (userId) {
      delete activeUsers[userId];
      delete socketToUser[socket.id];
      console.log(`User ${userId} disconnected`);
    }
  });
});

export async function notifyUser(userId, article) {
  console.log(`Notifying user ${userId} titled ${article.title}`);
  const socketId = activeUsers[userId];
  console.log(`Socket ID for user ${userId}: ${socketId}`);
  
  if (socketId) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit("new_article", {
        title: article.title,
        url: article.url,
        query: article.matchedQuery,
        content: article.content,
      });
      console.log(`Notification sent to user ${userId}`);
      
      await redis.setex(
        `notification:${userId}`,
        3600,
        JSON.stringify({
          title: article.title,
          url: article.url,
          query: article.matchedQuery,
          content: article.content,
        })
      );
    } else {
      // Socket doesn't exist anymore, clean up
      delete activeUsers[userId];
      delete socketToUser[socketId];
      console.log(`Socket ${socketId} for user ${userId} no longer exists, cleaned up`);
    }
  } else {
    console.log(`User ${userId} is not connected`);
  }
}

setInterval(clearOldNotifications, 3600000);

//Exceeding free tier limit so this cron job is stopped
// const pingServer = () => {
//   axios
//     .get(process.env.SERVER_URL)
//     .then((response) => {
//       console.log("Ping successful:", response.status);
//     })
//     .catch((error) => {
//       console.error("Ping failed:", error.message);
//     });
// };
// setInterval(pingServer, 300000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});