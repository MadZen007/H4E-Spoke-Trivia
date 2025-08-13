const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.static("public"));

// Main trivia game
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Member authentication page
app.get("/member-auth", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "member-auth.html"));
});

// User profile page
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

// Serve static files from src directory
app.use("/src", express.static(path.join(__dirname, "src")));

// Serve static files from images directory
app.use("/images", express.static(path.join(__dirname, "images")));

// Trivia API Routes
app.use("/api/trivia/questions", require("./api/questions"));
app.use("/api/trivia/track", require("./api/track"));
app.use("/api/trivia/stats", require("./api/stats"));
app.use("/api/trivia/suggest", require("./api/suggest"));
app.use("/api/trivia/generate", require("./api/generate-questions"));
app.use("/api/trivia/setup", require("./api/setup"));
app.use("/api/trivia/member/login", require("./api/member/login"));
app.use("/api/trivia/member/signup", require("./api/member/signup"));

app.listen(PORT, () => {
  console.log(`H4E-Spoke-Trivia running on port ${PORT}`);
});
