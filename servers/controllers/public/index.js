import express from "express";
import bcrypt from "bcrypt";
import userModel from "../../models/Users.js";

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword
    });

    // Save user session
    req.session.userId = newUser._id;

    // res.status(201).json({ success: true, user: newUser });
    res
      .status(201)
      .json({
        msg: "User registered successfully. Please verify your email and phone.",
      });
  } catch (error) {
      console.log(error);
    res.status(500).json({ success: false, message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Save session
    req.session.userId = user._id; // IMPORTANT!
    console.log("Login successful, session created for user:", user._id);

    // Don't return token (you’re not using JWT)
    res.status(200).json({ success: true, message: "Login successful", user: { email: user.email, name: user.name } });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }

});

// PROFILE
router.get("/profile", async (req, res) => {
  try {
    // Check if user is authenticated via session
    if (!req.session.userId) {
      console.log("No active session found.");
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    // Fetch user from DB by ID, exclude password
    const user = await userModel.findById(req.session.userId).select("-password");
    
    if (!user) {
      console.log(`User not found for ID: ${req.session.userId}`);
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Successful fetch
    console.log("User profile fetched:", user);
    res.status(200).json({ success: true, user });

  } catch (err) {
    // Catch and log any errors
    console.error("Error in GET /profile:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({ success: false, message: "Logout failed", error: err });

    res.clearCookie("notes.sid");
    return res.json({ success: true, message: "Logout successful" });
  });
});

export default router;
