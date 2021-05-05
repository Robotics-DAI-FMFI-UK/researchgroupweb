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

export default Module;
