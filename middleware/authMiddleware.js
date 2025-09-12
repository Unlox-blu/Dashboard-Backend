import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "thiswouldbethesecret";

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // throws if expired or invalid
    
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ JWT Error:", err);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired", error: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token", error: "Invalid token" });
    } else {
      return res
        .status(500)
        .json({ message: "Something went wrong", error: "Something went wrong" });
    }
  }
}
