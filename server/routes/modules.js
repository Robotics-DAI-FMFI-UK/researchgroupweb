import { Router } from "express";
import Module from "../models/Module";
import { fillCreate } from "./shared";
const router = Router();

/**
 * @route   POST /modules
 * @desc    Create new module
 */
router.post("/", async (req, res) => {
  const module = fillCreate(req, Module);
  try {
    const newModule = await module.save();
    res.status(201).json(newModule);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   GET /modules
 * @desc    Read all modules
 */

router.get("/", async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   GET /modules/page/:id
 * @desc    Read module by page id
 */

router.get("/page/:id", async (req, res) => {
  console.log(req.params);
  try {
    const modules = await Module.find({ page_id: req.params.id });
    res.json(modules);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   PATCH /modules/:id
 * @desc    Update module
 */

router.patch("/:id", getModule, async (req, res) => {
  if (req.body.type != null) {
    res.module.type = req.body.type;
  }
  if (req.body.reference != null) {
    res.module.reference = req.body.reference;
  }
  if (req.body.body != null) {
    res.module.body = req.body.body;
  }
  try {
    const updatedModule = await res.module.save();
    res.json(updatedModule);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   PATCH /modules
 * @desc    Update many modules
 */

router.patch("/", async (req, res) => {
  Module.bulkWrite(
    req.body.modules.map((module) => {
      return {
        updateOne: {
          filter: { _id: module._id },
          update: { $set: module },
          upsert: true,
          // new: true,
        },
      };
    })
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((e) => {
      res.status(400).json({ message: e.message });
    });
});

/**
 * @route   DELETE /modules
 * @desc    Delete many modules
 */

router.delete("/", async (req, res) => {
  try {
    await Module.deleteMany({ _id: { $in: req.body.removeIds } });
    res.json({ message: "Deleted modules" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * @desc    Middleware to get module by id
 */

async function getModule(req, res, next) {
  console.log(req.params.id);
  let module;
  try {
    module = await Module.findById(req.params.id);
    if (module === null) {
      return res.status(404).json({ message: "Cannot find the module" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }

  res.module = module;
  next();
}

export default router;
