import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);

// Fake users DB
const users = [
  { username: "rohit", password: "1234", role: "user" },
  { username: "admin", password: "admin", role: "admin" },
];
//  const user = users.find(u => u.username === username && u.password === password);

// Login route
app.post("/login", (req, res) => {
  const { username, password, role } = req.body;
  req.session.username = username;
  req.session.userrole = role;
  const UserChecking = users.find(
    (u) => u.username === username && u.password === password
  );
  if (UserChecking) {
    res.send("youe login sucessfull");
    console.log(req.session.userrole);
    // console.log(users);
  } else {
    res.send("you are not admin");
  }
});

app.get("/profile", (req, res) => {
  const { username, role } = req.body;
  res.send(`your name ${username} and your role ${role}`);
});

app.get("/admin-panel", (req, res) => {
  const UserRole = req.session.userrole;
  if (UserRole === "admin") {
 res.send("admin ")
  }else{
    res.send("you are not admin")
  }
});

// Set theme route
app.get("/set-theme/:name", (req, res) => {
  const themeColor = req.params.name;
  res.cookie("theme", themeColor);
  res.send(`Theme set to ${themeColor}`);
});

// Get theme route
app.get("/get-theme", (req, res) => {
  const theme = req.cookies.theme;
  if (theme) {
    res.send(`Your theme is ${theme}`);
  } else {
    res.send("No theme set ❌");
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
