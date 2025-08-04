import express from "express";
import userModel from "../../models/Users.js";

const router = express.Router();

// Get all users
router.get("/getallusers", async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No users found." });
    }

    res.status(200).json({
      msg: "Users retrieved successfully.",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "An error occurred while fetching users." });
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.status(200).json({
      msg: "User found.",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ msg: "An error occurred while fetching the user." });
  }
});

export default router;
