import express from "express";
import { createNote, getNotes, updateNote, deleteNote,getNoteById } from "./noteController.js";
import { isAuthenticated } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createNote);
router.get("/", isAuthenticated, getNotes);
router.get("/:id", isAuthenticated, getNoteById);
router.put("/:id", isAuthenticated, updateNote);
router.delete("/:id", isAuthenticated, deleteNote);

export default router;
