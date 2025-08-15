"use strict";

const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "..", "data", "questions.json");
const dst = path.resolve(__dirname, "..", "data", "questions.fixed.json");

function normalize(s) {
  return String(s || "")
    .replace(/[‘’‚‛']/g, "'")
    .replace(/[“”„‟"]/g, '"')
    .replace(/–|—/g, "-")
    .replace(/\u00a0/g, " ")
    .trim()
    .toLowerCase();
}

const text = fs.readFileSync(src, "utf8");
const data = JSON.parse(text);

let mismatches = [];
let autoFixed = 0;

for (const q of data) {
  const id = Number(q.id);
  const opts = Array.isArray(q.options) ? q.options.map(String) : [];
  const ca = String(q.correctAnswer || q.correct_answer || "");
  const normOpts = opts.map(normalize);
  const normCA = normalize(ca);

  const idx = normOpts.indexOf(normCA);
  if (idx === -1) {
    mismatches.push({ id, correctAnswer: ca, options: opts });
  } else if (ca !== opts[idx]) {
    // Auto-fix to the exact option variant (case/quotes/hyphen normalization)
    q.correctAnswer = opts[idx];
    autoFixed++;
  }
}

fs.writeFileSync(dst, JSON.stringify(data, null, 2), "utf8");

console.log("Total:", data.length);
console.log("Auto-fixed answers:", autoFixed);
console.log("Mismatches remaining:", mismatches.length);
if (mismatches.length > 0) {
  console.log("First few mismatches:", JSON.stringify(mismatches.slice(0, 10), null, 2));
  console.log("IDs with mismatches (first 50):", mismatches.map(m => m.id).slice(0,50).join(", "));
  process.exitCode = 1;
} else {
  console.log("All answers now match one of the options (case/quotes/hyphen normalized).");
}
