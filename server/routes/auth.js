import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth";
import User from "../models/User";
import config from "../config";

const { JWT_SECRET } = config;
const router = Router();

/**
 * @route   POST /auth/login
 * @desc    Login user by email and passwd
 */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw Error("User with provided email doesn't exists");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw Error("Couldn't sign the token");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   POST /auth/register
 * @desc    Register new user
 */

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) throw Error("Email is already taken");

    if (password !== confirmPassword) throw Error("Passwords dont match");

    if (confirmPassword.length < 4)
      throw Error("Password is to short, use at least 4 characters");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const newUser = new User({
      name,
      email,
      password: hash,
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");
    console.log(savedUser);
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        avatar: savedUser.avatar,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
        register_date: savedUser.register_date,
      },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * @route   GET /auth/user
 * @desc    Get user data
 */

router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password"); //.select("-password");
    if (!user) throw Error("User does not exist");
    res.json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
