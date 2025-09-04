const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.static("public"));

// API routes
app.use('/api/contest-registrations', require('./api/contest-registrations'));
app.use('/api/submit-game-score', require('./api/submit-game-score'));
app.use('/api/validate-game-link', require('./api/validate-game-link'));
app.use('/api/trivia', require('./api/trivia-track'));
app.use('/api/trivia', require('./api/trivia-questions'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`H4E-Spoke-Trivia running on port ${PORT}`);
});
