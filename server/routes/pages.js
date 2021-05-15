import { Router } from "express";
import Page from "../models/Page";
import Module from "../models/Module";
import mongoose from "mongoose";
import { fillUpdate, fillCreate } from "./shared";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const page = fillCreate(req, Page);
    const newPage = await page.save();

    res.status(201).json({ newPage });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// CREATE with layouts
router.post("/with-layouts", async (req, res) => {
  try {
    let page = fillCreate(req, Page);

    const breakpoints = ["lg", "md", "sm"];
    const layouts = {};

    // TODO kopiu to sice robi, ale zle priradi moduly ku layout
    const moduleIds = req.body.layouts.lg.map((position) => position.i);
    const modules = await Module.find({ _id: { $in: moduleIds } }); // { _id: 0 });

    const withoutIds = modules.map((module) => {
      // delete module._id;
      return {
        type: module.type,
        body: module.body,
        reference: module.reference,
      };
    });

    const newModules = await Module.insertMany(withoutIds, {
      ordered: true,
    });
    const insertedIds = newModules.map((res) => res._id);

    breakpoints.forEach((bp) => {
      layouts[bp] = req.body.layouts[bp].map((p, index) => {
        return {
          x: p.x,
          y: p.y,
          w: p.w,
          h: p.h,
          static: p.static,
          i: insertedIds[index],
        };
      });
    });

    page.layouts = layouts;

    // TODO transaction
    // init session
    // const session = await Page.startSession();
    // session.startTransaction();
    //
    // try {
    //   const opts = { session };
    //   const newModules = await Module.insertMany(withoutIds, opts);
    //   const newIds = newModules.map((res) => res._id);
    //
    //   breakpoints.forEach((bp) => {
    //     layouts[bp] = req.body.layouts[bp].map((p, index) => {
    //       return {
    //         x: p.x,
    //         y: p.y,
    //         w: p.w,
    //         h: p.h,
    //         static: p.static,
    //         i: newIds[index],
    //       };
    //     });
    //   });
    //
    //   page.layouts = layouts;
    //
    //   const newPage = await page.save();
    //
    //   await session.commitTransaction();
    //   session.endSession();
    //   return res.status(201).json(newPage);
    // } catch (error) {
    //   // abort transaction and undo any changes
    //   await session.abortTransaction();
    //   session.endSession();
    //   return res.status(400).json({ message: e.message });
    // }
    const newPage = await page.save();
    res.status(201).json({ newPage, newModules });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// FIND one
router.get("/:id", getPage, (req, res) => {
  res.json(res.page);
});

// // FIND pages by created_by
// router.get("/created_by/:id", getPage, (req, res) => {
//
// });

// FIND all
router.get("/", async (req, res) => {
  try {
    const pages = await Page.find().populate({
      path: "created_by",
      select: { _id: 1, name: 1 },
    });

    const pagesWithModules = [];

    for (const page of pages) {
      const moduleIds = page.layouts.lg.map((position) => position.i);
      const modules = await Module.find({ _id: { $in: moduleIds } });
      pagesWithModules.push({
        layouts: page.layouts,
        published: page.published,
        create_date: page.create_date,
        update_date: page.update_date,
        _id: page._id,
        title: page.title,
        path: page.path,
        template: page.template,
        created_by: page.created_by,
        modules: modules,
      });
    }

    console.log("pagesWithModules", pagesWithModules);

    res.json(pagesWithModules);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// UPDATE
router.patch("/:id", getPage, async (req, res) => {
  try {
    const updated = fillUpdate(req, res, "page");
    const saved = await updated.save();
    res.json(saved);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// UPDATE layouts and modules
router.patch("/with-grid/:id", async (req, res) => {
  try {
    const { layouts, modules, removeIds } = req.body;
    // console.log("page._id", req.params.id);
    // console.log("layouts", layouts);
    // console.log("modules", modules);
    // console.log("removeIds", removeIds);

    const savedPage = await Page.findByIdAndUpdate(
      { _id: req.params.id },
      { layouts }
    );

    const savedModules = await Module.bulkWrite(
      modules.map((module) => {
        return {
          updateOne: {
            filter: { _id: module._id },
            update: { $set: module },
            upsert: true,
          },
        };
      })
    );

    // TODO remove module only if it's id is not in other pages layouts
    const pages = await Page.find({ _id: { $ne: req.params.id } });
    const remainIds = [];
    removeIds.forEach((_id) => {
      const objId = _id;

      for (let i = 0; i < pages.length; i++) {
        const ids = pages[i].layouts.lg.map((p) => p.i);
        if (ids.includes(objId)) {
          remainIds.push(objId);
          return;
        }
      }
    });
    const deleteIds = removeIds.filter((_id) => !remainIds.includes(_id));

    const deletedModules = await Module.deleteMany({
      _id: { $in: deleteIds },
    });

    res.json({ message: "Page updated successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DELETE
router.delete("/:id", getPage, async (req, res) => {
  try {
    await res.page.remove();
    res.json({ message: "Deleted page" });
    console.log("removed page");
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/import", (req, res) => {
  if (!req.files) return res.status(400).json({ msg: "No file uploaded" });

  let file = req.files.file;
  if (!file) file = req.files.image;
  console.log("file", file);

  if (file.mimetype !== "application/json") {
    return res.status(500).json({ message: "Import allows only json file" });
  }

  const readFile = JSON.parse(file.data);

  return res.json({ readFile: readFile });
});

// Middlewares
async function getPage(req, res, next) {
  let page;
  try {
    page = await Page.findById(req.params.id).populate({
      path: "created_by",
      select: { _id: 1, name: 1 },
    });

    if (page === null) {
      return res.status(404).json({ message: "Cannot find the page" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }

  res.page = page;
  next();
}

export default router;
