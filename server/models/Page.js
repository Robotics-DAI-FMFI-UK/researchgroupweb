import { Schema, model } from "mongoose";
import Navbar from "./Navbar";
import Module from "./Module";
const uniqueValidator = require("mongoose-unique-validator");

const reservedPaths = ["/users", "/pages", "/nav", "/profile"];

const layoutSchema = Schema(
  {
    i: {
      type: Schema.Types.ObjectId,
      ref: "module",
    },
    x: Number,
    y: Number,
    w: Number,
    h: Number,
    static: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const PageSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    validate: {
      validator: (title) => title.length < 35,
      message: () => "Title is too long",
    },
  },
  description: {
    type: String,
  },
  path: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    validate: [
      {
        validator: (path) => path.match(/^\/[/.a-zA-Z0-9-]*$/),
        message: () => "Not valid url path!",
      },
      {
        validator: (path) => !reservedPaths.includes(path),
        message: () => "The path is reserved",
      },
    ],
  },
  published: {
    type: Boolean,
    default: false,
  },
  layouts: {
    lg: [layoutSchema],
    md: [layoutSchema],
    sm: [layoutSchema],
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  create_date: {
    type: Date,
    default: Date.now(),
  },
  update_date: {
    type: Date,
    default: Date.now(),
  },
});

PageSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique",
});

PageSchema.post("remove", async (page) => {
  Navbar.updateMany(
    { "items.pages": page._id, published: true },
    { $pullAll: { uid: [page._id] } }
  );
  const moduleIds = page.layouts.lg.map((position) => position.i);

  if (Array.isArray(moduleIds)) {
    // select all pages except the removing
    const pages = await Page.find({ _id: { $ne: page._id } });

    // find module copy in pages
    const remainIds = [];
    moduleIds.forEach((_id) => {
      for (let i = 0; i < pages.length; i++) {
        const ids = pages[i].layouts.lg.map((p) => p.i);
        if (ids.includes(_id)) {
          remainIds.push(_id);
          return;
        }
      }
    });

    // filter remaining copies
    const deleteIds = moduleIds.filter((_id) => !remainIds.includes(_id));

    // execute delete query
    const deletedModules = await Module.deleteMany({
      _id: { $in: deleteIds },
    });
  }
});

const Page = model("page", PageSchema);

export default Page;
