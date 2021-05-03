import { Router } from "express";
import Navbar from "../models/Navbar";
import Page from "../models/Page";
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
  console.log("hello");
  let navbar;
  try {
    navbar = await Navbar.findOne({ published: true });
    console.log(navbar);
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
  console.log("read file", readFile);

  if (!isArray(readFile)) {
    res.status(500).json({ message: "Missing array brackets" });
  }

  return res.json({ readFile: readFile });

  // TODO handle import
  // let errMsg = validateNavbarJSON(readFile);
  // if (errMsg) return res.status(500).json({ message: errMsg });
  // const output = [];
  //
  // const outputItems = readFile.map((item) => {
  //   if (isString(item)) {
  //     Page.findOne(
  //       { title: { $regex: item, $options: "i" } },
  //       "path title",
  //       (err, data) => {
  //         if (err) errMsg = "xx";
  //         console.log("page", data);
  //         output.push(data);
  //         return data;
  //       }
  //     );
  // const page = parseNavbarItem(item);
  // if (!page) {
  //   errMsg = `Page with title ${item} not found`;
  //   return;
  // }
  // console.log("page", page);
  // outputItems.push(page);
  // return page;
  // } else {
  //   const dropdown = [item[0]];
  //   console.log("hello", item);
  //   for (let i = 1; i < item.length; i++) {
  //     console.log("world");
  //     const res = Page.findOne(
  //       { title: { $regex: item[i], $options: "i" } },
  //       "path title",
  //       (err, data) => {
  //         if (err) errMsg = "xx";
  //         console.log("dropdown", data);
  //         dropdown.push(data);
  //       }
  //     ).exec();
  //
  //     console.log("res", res);
  // const page = parseNavbarItem(item[i]);
  // if (!page) {
  //   errMsg = `Page with title ${item[i]} not found`;
  //   return;
  // }
  // console.log("dropdown", page);
  // dropdown.push(page);
  //     }
  //     output.push(dropdown);
  //     return dropdown;
  //   }
  // });
  //
  // console.log("output", output);
  //
  // if (errMsg) return res.status(500).json({ message: errMsg });
  //
  // return res.json({ readFile: outputItems });
});

function validateNavbarJSON(readFile) {
  if (!isArray(readFile)) return "Missing array brackets";

  for (let i = 0; i < readFile.length; i++) {
    const item = readFile[i];
    if (!item) {
      return `${i} - item cannot be empty`;
    }
    if (isString(item)) {
      continue;
    }
    if (!isArray(item)) {
      return `${i} - item must be a string or array`;
    }

    const dropdown = item;
    if (dropdown.length < 3) {
      return `${i} - dropdown missing name or pages`;
    }
    dropdown.forEach((item, j) => {
      if (!isString(item)) {
        return `${i},${j} - page must be a string`;
      }
    });
  }
}

function sortObject(obj) {
  return Object.keys(obj).sort((a, b) => a - b);
}

function isString(obj) {
  return typeof obj === "string";
}

function isNumber(obj) {
  return typeof obj === "number";
}

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
