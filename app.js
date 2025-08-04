import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";

import dbConnect from "./servers/utils/dbConnect.js";
import publicRoutes from "./servers/controllers/public/index.js";
import userRoutes from "./servers/controllers/users/index.js";
import noteRoutes from "./servers/controllers/notes/index.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Connect DB
dbConnect();

app.use(
  cors({
    origin: 'http://localhost:5008', 
    credentials: true, // must be true to send cookies
    
  })
);

// Middleware
// app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// Session Setup
// Before routes:
app.use(
  session({
    name: "notes.sid",
    secret: process.env.SESSION_SECRET || "ISHWARI",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // false is fine for localhost (HTTP)
      sameSite: "lax", // helps avoid CSRF while still supporting cross-origin POSTs
    }
  })
);




// Routes
app.use("/api", publicRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notes", noteRoutes);


app.get("/", (req, res) => res.send("API running"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
