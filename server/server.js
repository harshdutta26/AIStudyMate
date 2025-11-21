const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
require("dotenv").config();
const fs = require("fs");
const pdf = require("pdf-parse");
const bcrypt = require("bcrypt");
const { GoogleGenAI } = require("@google/genai");
const path = require("path");
const userModel = require("./user");
const fileModel = require("./file");
const cors = require("cors");
const app = express();
app.set("trust proxy", 1);

const session = require("express-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/verifyToken");
const flash = require("connect-flash");

const isProd = process.env.NODE_ENV === "production";



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: isProd
      ? "https://aistudymate.vercel.app"
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use((req, res, next) => {
  console.log("➡️ Route Hit:", req.path);
  console.log("➡️ Cookies:", req.cookies);
  next();
});

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "any",
    cookie: {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd ? true : false,
    },
  })
);

app.use(flash());


app.get("/", async (req, res) => {
  console.log("🔥 ROOT HIT");
  console.log("Session UserID:", req.session.userId);

  if (!req.session.userId) {
    return res.json([]);
  }

  const uploadedFiles = await fileModel.find({ userId: req.session.userId });
  return res.json(uploadedFiles);
});

// Delete user files
app.get("/delete", async (req, res) => {
  const myUserId = req.session.userId;
  await fileModel.deleteOne({ userId: myUserId });

  res.json({ success: true, message: "Deleted Successfully" });
});



// MCQ Generator
app.get("/Mcq", verifyToken, async (req, res) => {
  try {
    const api_Key = process.env.GEMINI_API_KEY;
    if (!api_Key) return res.status(500).json({ message: "Missing Gemini Key" });

    const ai = new GoogleGenAI({ apikey: api_Key });

    const file = await fileModel.findById(req.session.selectedFileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const prompt = `Make 10 MCQs from this text:\n ${file.content}`;

    const ans = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ success: true, mcq: ans.text });
  } catch (err) {
    console.log("MCQ ERROR", err);
    res.status(500).json({ success: false, message: "AI Error", err });
  }
});

// Summary Generator
app.get("/Summary", verifyToken, async (req, res) => {
  try {
    const api_Key = process.env.GEMINI_API_KEY;

    const ai = new GoogleGenAI({ apikey: api_Key });

    const file = await fileModel.findById(req.session.selectedFileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const prompt = `Summarize this:\n ${file.content}`;

    const ans = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ success: true, summary: ans.text });
  } catch (err) {
    res.status(500).json({ success: false, message: "AI Error", err });
  }
});

// Logout
app.get("/Logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out" });
  });
});


app.get("/foundFile", async (req, res) => {
  try {
    const fileName = req.query.fileName;
    console.log("Found File Request:", fileName);

    const file = await fileModel.findOne({ fileName });

    if (!file) return res.status(404).json({ message: "File Not Found" });

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Select a file
app.post("/selectFile", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });

  const fileId = req.body.gotFileId;
  const file = await fileModel.findOne({ _id: fileId, userId: req.session.userId });

  if (!file) return res.status(404).json({ message: "File not found" });

  req.session.selectedFileId = fileId;

  res.json({ success: true, message: file });
});

// Upload PDF
app.post("/fileUpload", upload.single("file"), verifyToken, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const buffer = fs.readFileSync(req.file.path);
    const data = await pdf(buffer);

    const fileData = new fileModel({
      userId: req.session.userId,
      fileName: req.file.originalname,
      content: data.text,
    });

    await fileData.save();

    res.json({ success: true, message: "File uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Upload error", err });
  }
});



// Signup
app.post("/SignUp", async (req, res) => {
  const { username, emailId, hashPassword } = req.body;

  if (!username || !emailId || !hashPassword)
    return res.status(400).json({ message: "All fields required" });

  if (hashPassword.length < 6)
    return res.status(400).json({ message: "Min password length 6" });

  try {
    const exists = await userModel.findOne({ emailId });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(hashPassword, 10);
    const token = jwt.sign({ token: emailId }, process.env.SECRET_KEY);

    const user = new userModel({ username, emailId, hashPassword: hashed });
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd ? true : false,
    });

    res.status(201).json({ success: true, username, emailId });
  } catch (err) {
    res.status(500).json({ message: "Registration error", err });
  }
});

// Login
app.post("/Login", async (req, res) => {
  const { emailId, hashPassword } = req.body;

  if (!emailId || !hashPassword)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const user = await userModel.findOne({ emailId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(hashPassword, user.hashPassword);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ token: emailId }, process.env.SECRET_KEY);

    req.session.userId = user._id;

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd ? true : false,
    });

    res.json({ success: true, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Login error", err });
  }
});


app.listen(3000, () => console.log("Server running"));
