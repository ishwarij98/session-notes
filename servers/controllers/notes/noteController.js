import noteModel from "../../models/Notes.js";

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log("[CREATE NOTE] Session User ID:", req.session.userId);
    console.log("[CREATE NOTE] Request Body:", req.body);

    const note = await noteModel.create({
      user: req.session.userId,
      title,
      content,
    });

    console.log("[CREATE NOTE] Note Created:", note);
    res.status(201).json({ success: true, note });
  } catch (err) {
    console.error("[CREATE NOTE ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Get all notes for logged-in user
export const getNotes = async (req, res) => {
  try {
    console.log("[GET NOTES] Session User ID:", req.session.userId);

    const notes = await noteModel.find({ user: req.session.userId });

    console.log(`[GET NOTES] Fetched ${notes.length} notes`);
    res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error("[GET NOTES ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[GET NOTE BY ID] Note ID:", id);
    console.log("[GET NOTE BY ID] Session User ID:", req.session.userId);

    const note = await noteModel.findOne({ _id: id, user: req.session.userId });

    if (!note) {
      console.warn("[GET NOTE BY ID] Note not found or unauthorized");
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    console.log("[GET NOTE BY ID] Note Found:", note);
    res.status(200).json({ success: true, note });
  } catch (err) {
    console.error("[GET NOTE BY ID ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Update a note by ID
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    console.log("[UPDATE NOTE] Note ID:", id);
    console.log("[UPDATE NOTE] Request Body:", req.body);
    console.log("[UPDATE NOTE] Session User ID:", req.session.userId);

    const note = await noteModel.findOneAndUpdate(
      { _id: id, user: req.session.userId },
      { title, content },
      { new: true }
    );

    if (!note) {
      console.warn("[UPDATE NOTE] Note not found or unauthorized");
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    console.log("[UPDATE NOTE] Updated Note:", note);
    res.status(200).json({ success: true, note });
  } catch (err) {
    console.error("[UPDATE NOTE ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Delete a note by ID
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("[DELETE NOTE] Note ID:", id);
    console.log("[DELETE NOTE] Session User ID:", req.session.userId);

    const note = await noteModel.findOneAndDelete({ _id: id, user: req.session.userId });

    if (!note) {
      console.warn("[DELETE NOTE] Note not found or unauthorized");
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    console.log("[DELETE NOTE] Note Deleted:", note._id);
    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (err) {
    console.error("[DELETE NOTE ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
