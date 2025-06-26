const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  scheduledTime: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Taken", "Missed"], default: "Pending" },
});

module.exports = mongoose.model("Reminder", reminderSchema);
