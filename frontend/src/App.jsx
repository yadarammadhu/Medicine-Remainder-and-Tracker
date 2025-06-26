import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddMedicine from "./pages/AddMedicine";  
import EditMedicine from "./pages/EditMedicine";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<h1 className="welcome-title">Welcome to MedTrack</h1>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-medicine" element={<AddMedicine />} />
          <Route path="/edit-medicine/:id" element={<EditMedicine />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;