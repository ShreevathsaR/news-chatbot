import axios from "axios";

const api = axios.create({
  // baseURL: "https://news-chatbot-3ynr.onrender.com/api",
  baseURL: "http://localhost:5000/api",
});

export default api;
