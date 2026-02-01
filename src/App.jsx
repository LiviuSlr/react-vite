import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/home";
import LogBook from "./pages/logbook";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Community from "./pages/community";
import Account from "./pages/account";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/logbook" element={<LogBook />} />
        <Route path="/community" element={<Community/>}/>
      </Routes>
    </BrowserRouter>
  );
}
