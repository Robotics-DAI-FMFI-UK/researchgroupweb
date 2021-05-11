import jwt from "jsonwebtoken";
import config from "../config";

const { JWT_SECRET } = config;

export default (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET); // decode
    next();
  } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
  }
};
