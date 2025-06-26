import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPills, FaPlus, FaArrowLeft } from "react-icons/fa";

const AddMedicine = () => {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "once daily",
    time: [""]
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.time];
    newTimes[index] = value;
    setFormData(prev => ({
      ...prev,
      time: newTimes
    }));
  };

  const addTimeField = () => {
    setFormData(prev => ({
      ...prev,
      time: [...prev.time, ""]
    }));
  };

  const removeTimeField = (index) => {
    if (formData.time.length > 1) {
      const newTimes = formData.time.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        time: newTimes
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/medicines/add",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Medicine added successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Error adding medicine:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add medicine");
    }
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate(-1)} className="btn btn-outline back-btn">
        <FaArrowLeft /> Back
      </button>
      
      <div className="card">
        <div className="form-header">
          <FaPills className="form-icon" />
          <h2>Add New Medicine</h2>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Medicine Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dosage</label>
            <input
              type="text"
              className="form-control"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select
              className="form-control"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
            >
              <option value="once daily">Once Daily</option>
              <option value="twice daily">Twice Daily</option>
              <option value="three times daily">Three Times Daily</option>
              <option value="as needed">As Needed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dosage Times</label>
            {formData.time.map((time, index) => (
              <div key={index} className="time-input-group">
                <input
                  type="time"
                  className="form-control"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  required
                />
                {formData.time.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeField(index)}
                    className="btn btn-danger remove-time-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTimeField}
              className="btn btn-outline add-time-btn"
            >
              <FaPlus /> Add Another Time
            </button>
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            <FaPlus /> Add Medicine
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;