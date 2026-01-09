// Routing

import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import LogBook from "./pages/logbook";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logbook" element={<LogBook />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
