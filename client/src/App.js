import "./App.css";
import Home from "./Pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Tickets from "./Components/Tickets";
import Footer from "./Components/Footer";
import Dashboard from "./Components/Admin/Dashboard";
import Profile from "./Components/Profile";
import Error from "./Components/Error";



function App() {

  const user = localStorage.getItem("user");

  return (
    <div className="w-[100%] animate-fade h-auto mx-auto">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route 
          path="/admin/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
