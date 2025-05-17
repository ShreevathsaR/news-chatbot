import axios from "axios";

const api = axios.create({
  baseURL: "https://news-chatbot-3ynr.onrender.com/api",
});

export default api;
