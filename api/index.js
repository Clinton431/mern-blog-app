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
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const uploadMiddleware = multer({ dest: "uploads/" });

// bcrypt/jwt settings
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CORS
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✔ MongoDB Connected"))
  .catch((e) => console.log(e));

// AUTH
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
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
      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .json({
          id: userDoc._id,
          username,
        });
    });
  } else {
    res.status(400).json("Wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json("Invalid");
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, secure: true }).json("ok");
});

// ------------------------
// CREATE POST (Cloudinary)
// ------------------------
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Unauthorized");

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_uploads",
      });

      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const { title, summary, content } = req.body;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: imageUrl,
      author: info.id,
    });

    res.json(postDoc);
  });
});

// ------------------------
// UPDATE POST (Cloudinary)
// ------------------------
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json("Unauthorized");

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);

    if (!postDoc) return res.status(404).json("Not found");
    if (String(postDoc.author) !== String(info.id))
      return res.status(403).json("Forbidden");

    let imageUrl = postDoc.cover;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_uploads",
      });

      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = imageUrl;

    await postDoc.save();
    res.json(postDoc);
  });
});

// POSTS
app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 });

  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", [
    "username",
  ]);
  res.json(post);
});

// SERVER
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 API running on ${port}`));
