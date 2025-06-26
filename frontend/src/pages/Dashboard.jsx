import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { FaPlus, FaEdit, FaTrash, FaBell } from "react-icons/fa";

const Dashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchMedicines = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/medicines", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicines(res.data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/medicines/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(medicines.filter((med) => med._id !== id));
    } catch (err) {
      console.error("Error deleting medicine:", err);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My Medicine Tracker</h2>
        <button
          onClick={() => navigate("/add-medicine")}
          className="btn btn-primary"
        >
          <FaPlus /> Add Medicine
        </button>
      </div>

      {medicines.length === 0 ? (
        <div className="card text-center">
          <p>No medicines added yet.</p>
        </div>
      ) : (
        <div className="medicines-grid">
          {medicines.map((med) => (
            <div key={med._id} className="medicine-card">
              <div className="medicine-info">
                <h3>{med.name}</h3>
                <p className="dosage">{med.dosage}</p>
                <div className="medicine-meta">
                  <span className="frequency">{med.frequency}</span>
                  <div className="times">
                    {med.time.map((t, i) => (
                      <span key={i} className="time-badge">
                        <FaBell /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="medicine-actions">
                <button 
                  onClick={() => navigate(`/edit-medicine/${med._id}`)}
                  className="btn btn-outline"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(med._id)}
                  className="btn btn-danger"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;