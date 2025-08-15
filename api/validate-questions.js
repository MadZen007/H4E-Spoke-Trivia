"use strict";

const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "..", "data", "questions.json");
const text = fs.readFileSync(file, "utf8");
let data;
try {
  data = JSON.parse(text);
} catch (e) {
  console.error("JSON parse error:", e.message);
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error("questions.json must be a JSON array");
  process.exit(1);
}

let isValid = true;
const seenIds = new Set();

for (const q of data) {
  const id = Number(q.id);
  if (!Number.isInteger(id)) {
    console.error("Invalid id:", q.id);
    isValid = false; break;
  }
  if (seenIds.has(id)) {
    console.error("Duplicate id:", id);
    isValid = false; break;
  }
  seenIds.add(id);

  if (!q.question || typeof q.question !== "string") {
    console.error("Missing/invalid question for id", id);
    isValid = false; break;
  }
  if (!Array.isArray(q.options) || q.options.length < 2) {
    console.error("Options must be an array with at least 2 choices for id", id);
    isValid = false; break;
  }
  if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
    console.error("correctAnswer must be one of options for id", id);
    isValid = false; break;
  }
}

console.log("VALID:", isValid, "COUNT:", data.length);
if (isValid) {
  console.log("Sample first 2:", JSON.stringify(data.slice(0,2), null, 2));
}
