require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

// Load .env secrets
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

// CORS for frontend
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// ---------------------------
// MongoDB Connection
// ---------------------------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✔ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------------------------
// Authentication Routes
// ---------------------------

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const UserDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(UserDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) return res.status(400).json("User not found");

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json("Invalid token");
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
});

// ---------------------------
// Post Creation
// ---------------------------

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const ext = originalname.split(".").pop();
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Unauthorized");

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
  });
});

// ---------------------------
// Post Update
// ---------------------------

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const ext = originalname.split(".").pop();
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Unauthorized");

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);

    if (!postDoc) return res.status(404).json("Post not found");

    const isAuthor = String(postDoc.author) === String(info.id);
    if (!isAuthor) return res.status(403).json("You are not the author");

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (newPath) postDoc.cover = newPath;

    await postDoc.save();
    res.json(postDoc);
  });
});

// ---------------------------
// Get Posts
// ---------------------------

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

// ---------------------------
// Start Server
// ---------------------------
app.listen(4000, () => console.log("API running on port 4000"));
