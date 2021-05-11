import { Router } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { getModelById, fillUpdate } from "./shared";
const router = Router();

/**
 * @route   GET /users
 * @desc    Get all users
 */

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   PATCH /users/:id
 * @desc    Update user's profile
 * @param   req.body.email,
 *          req.body.name
 */

router.patch("/:id", getUser, async (req, res) => {
  // if ("password" in req.body) req.redirect /password/:id
  const { email } = req.body;

  try {
    if (email && email !== res.user.email) {
      const user = await User.findOne({ email });
      if (user) throw Error("Email is already taken");
    }

    const updated = fillUpdate(req, res, "user");
    const saved = await updated.save();
    res.json(saved);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   PATCH /users/:id
 * @desc    Update user's password
 * @param   req.body.password,
 *          req.body.newPassword
 *          req.body.confirmPassword
 */

router.patch("/password/:id", getUser, async (req, res) => {
  const { password, newPassword, confirmPassword } = req.body;

  try {
    const isMatch = await bcrypt.compare(password, res.user.password);
    if (!isMatch) throw Error("Invalid credentials");

    if (password === newPassword)
      throw Error("New password is the same as the current");

    if (confirmPassword !== newPassword) throw Error("Passwords dont match");

    if (newPassword.length < 4)
      throw Error("Password is to short, use at least 4 characters");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(newPassword, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const savedUser = await res.user.updateOne({ password: hash });
    res.json(savedUser);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   DELETE /users
 * @desc    Delete the user
 */

router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

async function getUser(req, res, next) {
  res.user = await getModelById(req, res, User);
  next();
}

export default router;
