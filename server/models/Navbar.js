import { Schema, model } from "mongoose";

const NavbarSchema = new Schema({
  published: {
    type: Boolean,
    default: false,
    required: true,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  create_date: {
    type: Date,
    default: Date.now(),
  },
  items: [
    {
      x: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        default: "",
        validate: {
          validator: (name) => name.length < 15,
          message: () => "Dropdown name is too long",
        },
      },
      pages: {
        type: [{ type: Schema.Types.ObjectId, ref: "page" }],
        required: true,
      },
    },
  ],
});

const Navbar = model("navbar", NavbarSchema);

export default Navbar;
