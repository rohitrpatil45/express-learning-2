import express from "express"
import ConnectDB from "./db.js"
import User from "./models/User.js";   // <-- here

const app = express()
app.use(express.json()); // handles JSON requests
app.use(express.urlencoded({ extended: true })); // handles form-data (urlencoded)

const PORT = 3000

app.get('/', (req, res) => {
  res.send("hello world")
})

ConnectDB()

// Register new user
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT , () => {

console.log("server is running")

})