require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const Post = require("../models/Post");

const MONGO_URL = process.env.MONGO_URL;

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImages() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to MongoDB");

  const posts = await Post.find();

  for (const post of posts) {
    if (!post.cover) {
      console.log(`⚠️ Skipped (no image): ${post._id}`);
      continue;
    }

    // Skip already migrated images
    if (post.cover.startsWith("http")) {
      console.log(`✅ Already migrated: ${post._id}`);
      continue;
    }

    const localPath = path.join(__dirname, "..", post.cover);

    if (!fs.existsSync(localPath)) {
      console.log(`❌ File not found for post: ${post._id}`);
      continue;
    }

    try {
      console.log(`⬆️ Uploading: ${post.cover}`);

      const upload = await cloudinary.uploader.upload(localPath, {
        folder: "blog_uploads",
      });

      post.cover = upload.secure_url;
      await post.save();

      console.log(`✅ Migrated: ${post._id}`);
    } catch (err) {
      console.error(`❌ Failed for post ${post._id}`, err.message);
    }
  }

  console.log("🎉 Migration complete");
  process.exit();
}

migrateImages();
