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

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("authenticate", (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

export async function notifyUser(userId, article) {
  console.log(`Notifying user ${userId} titled ${article.title}`);
  const socketId = activeUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("new_article", {
      title: article.title,
      url: article.url,
      query: article.matchedQuery,
      content: article.content,
    });
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
  }
}

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
