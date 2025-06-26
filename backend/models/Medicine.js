const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true }, // e.g., "Twice a day"
  time: { type: [String], required: true }, // ["08:00 AM", "08:00 PM"]
});

module.exports = mongoose.model("Medicine", medicineSchema);
