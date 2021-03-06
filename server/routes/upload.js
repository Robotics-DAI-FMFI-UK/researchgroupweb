import { Router } from "express";
import path from "path";

const router = Router();
const appRoot = path.resolve(__dirname);

router.post("/", (req, res) => {
  if (!req.files) return res.status(400).json({ msg: "No file uploaded" });

  let file = req.files.file;
  if (!file) file = req.files.image;

  const name = `[${Date.now()}]-${file.name.replace(/ /g, "-")}`;
  const path = `${appRoot}/../uploads/${name}`;

  file.mv(path, (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({
      success: 1,
      fileName: file.name,
      filePath: `/uploads/${name}`,
      file: {
        name: file.name,
        size: file.size,
        url: `/uploads/${name}`,
      },
    });
  });
});

export default router;
