import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB connect (your string) ---
mongoose.connect("mongodb+srv://rohitrajupatil12_db_user:rohit123@cluster10.r0ztyrl.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Error: ", err));

// --- Schema & Model ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // stored hashed
});
const User = mongoose.model("User", userSchema);

// --- Session middleware ---
app.use(session({
  secret: "replace_with_a_strong_secret", // change this in production
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// --- Signup (hash password) ---
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).send("Provide username & password");

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashed });
    await newUser.save();

    res.send("✅ User registered successfully!");
  } catch (err) {
    res.status(400).send("❌ Error: " + err.message);
  }
});

// --- Login (compare password and create session) ---
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).send("Provide username & password");

    const user = await User.findOne({ username });
    if(!user) return res.status(401).send("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(401).send("Invalid credentials");

    // create session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.send("✅ Logged in!");
  } catch (err) {
    res.status(500).send("❌ Error: " + err.message);
  }
});

// --- Middleware to protect routes ---
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).send("Please log in to access this resource");
}

// --- Example protected route ---
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`Welcome ${req.session.username} — this is your dashboard`);
});

// --- Logout ---
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if(err) return res.status(500).send("Logout error");
    res.send("✅ Logged out");
  });
});

app.get("/", (req, res) => res.send("Server is running 🚀"));

app.listen(3000, () => console.log("Server started on http://localhost:3000"));
