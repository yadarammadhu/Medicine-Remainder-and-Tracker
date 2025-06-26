import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const EditMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/medicines`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const medicine = res.data.find((med) => med._id === id);
        if (medicine) {
          setName(medicine.name);
          setDosage(medicine.dosage);
          setFrequency(medicine.frequency);
          setTime(medicine.time);
        } else {
          setError("Medicine not found.");
        }
      } catch (err) {
        console.error("Error fetching medicine:", err);
        setError("Failed to fetch medicine details.");
      }
    };

    fetchMedicine();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/medicines/update/${id}`,
        { name, dosage, frequency, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating medicine:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Failed to update medicine");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>✏️ Edit Medicine</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleUpdate}>
        <div>
          <label>Medicine Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Dosage:</label>
          <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
        </div>
        <div>
          <label>Frequency:</label>
          <input type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} required />
        </div>
        <div>
          <label>Time (comma-separated):</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value.split(","))}
            required
          />
        </div>

        <button type="submit" style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px" }}>
          💾 Update Medicine
        </button>
      </form>
    </div>
  );
};

export default EditMedicine;
