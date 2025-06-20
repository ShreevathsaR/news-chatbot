import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newsRoutes from "./routes/newsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import axios from "axios";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", newsRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (_req, res) => {
  res.send("API IS RUNNING");
});

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
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
