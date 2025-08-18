import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../app/globals.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import { Toaster } from "./components/ui/sonner";
import Protected from "./components/Protected";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster richColors />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Protected />}>
          <Route path="/" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
