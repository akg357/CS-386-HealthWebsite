import assert from "assert";
import fs from "fs";

// Read the HTML file
const html = fs.readFileSync("index.html", "utf8");

// Test 1: Check if the notification script exists
assert(
  html.includes("Welcome to the Health Website!"),
  "script not found"
);

console.log(" Test passed");
