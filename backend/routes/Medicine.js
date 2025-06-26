const express = require("express");
const { check, validationResult } = require("express-validator");
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 🔹 Add Medicine
router.post(
  "/add",
  [
    authMiddleware, // Ensures user is authenticated
    check("name", "Medicine name is required").not().isEmpty(),
    check("dosage", "Dosage is required").not().isEmpty(),
    check("frequency", "Frequency is required").not().isEmpty(),
    check("time", "At least one time is required").isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, dosage, frequency, time } = req.body;

      const medicine = new Medicine({
        userId: req.user.userId,
        name,
        dosage,
        frequency,
        time,
      });

      await medicine.save();
      res.json(medicine);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// 🔹 Get All Medicines for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.userId });
    res.json(medicines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 🔹 Update Medicine
router.put(
  "/update/:id",
  [authMiddleware, check("name", "Medicine name is required").not().isEmpty()],
  async (req, res) => {
    try {
      let medicine = await Medicine.findById(req.params.id);
      if (!medicine) return res.status(404).json({ msg: "Medicine not found" });

      // Ensure user owns the medicine
      if (medicine.userId.toString() !== req.user.userId) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      medicine = await Medicine.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(medicine);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// 🔹 Delete Medicine
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    let medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ msg: "Medicine not found" });

    // Ensure user owns the medicine
    if (medicine.userId.toString() !== req.user.userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await medicine.deleteOne();
    res.json({ msg: "Medicine deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
