import express from "express";
import ConnectDB from "./db.js";
import User from "./models/User.js"; // <-- here
import Product from "./models/Product.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json()); // handles JSON requests
app.use(express.urlencoded({ extended: true })); // handles form-data (urlencoded)
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "mysecret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // attach user data to req
    next();
  });
}

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("hello  world");
});

ConnectDB();

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const Passwordhashing = await bcrypt.hash(password, 10);

    const Newuser = new User({
      username,
      email,
      password: Passwordhashing,
    });

    await Newuser.save();
    // console.log("here")
    res.status(201).json({ message: "register scussfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // email checking
    const userchecking = await User.findOne({ email });
    if (!userchecking) {
      return res.json({ message: "a re tuzi email wrong hy" });
    }
    // password checking
    const passwordchecking = await bcrypt.compare(
      password,
      userchecking.password
    );
    if (!passwordchecking) {
      return res.json({ message: " a re lavdu , password wrong hy " });
    }

    const token = jwt.sign({ id: userchecking._id }, "mysecret", {
      expiresIn: "1h",
    });

    res.json({ message: "kadak re tu login  kels", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password"); // hide password
  res.json({ message: "Profile fetched", user });
  console.log(user.username)
});

app.listen(PORT, () => {
  console.log("server is running");
});
