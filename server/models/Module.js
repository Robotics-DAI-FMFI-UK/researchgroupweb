import { Schema, model } from "mongoose";

const ModuleSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
  },
  body: {
    type: JSON,
  },
});

const Module = model("module", ModuleSchema);

// TODO on delete "cascade" -> remove from pages layouts

export default Module;
