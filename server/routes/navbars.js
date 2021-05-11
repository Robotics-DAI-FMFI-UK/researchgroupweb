import { Router } from "express";
import Navbar from "../models/Navbar";
import { fillCreate } from "./shared";
const router = Router();

// CREATE
router.post("/", async (req, res) => {
  const item = fillCreate(req, Navbar);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// FIND the published
router.get("/published", async (req, res) => {
  let navbar;
  try {
    navbar = await Navbar.findOne({ published: true });
    if (navbar === null) {
      return res.status(404).json({ message: "Cannot find published navbar" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }

  res.json(navbar);
});

// FIND all
router.get("/", async (req, res) => {
  try {
    const navbars = await Navbar.find();
    res.json(navbars);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// UPDATE
router.patch("/", async (req, res) => {
  try {
    const { currentId, prevId } = req.body;
    const updated = await Navbar.findOneAndUpdate(
      { _id: currentId },
      { published: true }
    );
    await Navbar.findOneAndUpdate({ _id: prevId }, { published: false });

    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE
router.delete("/:id", getNavbar, async (req, res) => {
  try {
    const updatedNavbar = await res.navbar.remove();
    res.json(updatedNavbar);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// IMPORT
router.post("/import", (req, res) => {
  if (!req.files) return res.status(400).json({ msg: "No file uploaded" });

  let file = req.files.file;
  if (!file) file = req.files.image;
  console.log("file", file);

  if (file.mimetype !== "application/json") {
    return res.status(500).json({ message: "Import allows only json file" });
  }

  const readFile = JSON.parse(file.data);

  if (!isArray(readFile)) {
    res.status(500).json({ message: "Missing array brackets" });
  }

  return res.json({ readFile: readFile });
});

function isArray(obj) {
  return Array.isArray(obj);
}

// GET MIDDLEWARE
async function getNavbar(req, res, next) {
  let navbar;
  try {
    navbar = await Navbar.findById(req.params.id);
    if (navbar === null) {
      return res.status(404).json({ message: "Cannot find the navbar" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }

  res.navbar = navbar;
  next();
}

export default router;
