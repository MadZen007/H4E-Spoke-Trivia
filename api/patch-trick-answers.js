"use strict";

const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "..", "data", "questions.json");
const raw = fs.readFileSync(file, "utf8");
const data = JSON.parse(raw);

const targetIds = new Set([336, 382, 395]);
let patched = 0;

for (const q of data) {
  const id = Number(q.id);
  if (!targetIds.has(id)) continue;
  const ca = String(q.correctAnswer || q.correct_answer || "");
  if (!Array.isArray(q.options)) q.options = [];
  if (!q.options.includes(ca)) {
    q.options.push(ca);
    patched++;
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
console.log("Patched entries:", patched);
