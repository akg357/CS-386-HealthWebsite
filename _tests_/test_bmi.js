// test_bmi.js

import assert from "assert";
import fs from "fs";
import { bmi_metric, bmi_imperial } from "../main.js";

// Optional: verify that the file exists
assert.ok(fs.existsSync("../main.js"), "main.js file does not exist!");

// Test metric BMI
const metricBMI = bmi_metric(180, 75); // 180 cm, 75 kg → ~23.15
assert.ok(Math.abs(metricBMI - 23.15) < 0.01, `Metric BMI incorrect: got ${metricBMI}`);

// Test imperial BMI
const imperialBMI = bmi_imperial(70, 150); // 70 in, 150 lb → ~21.52
assert.ok(Math.abs(imperialBMI - 21.52) < 0.01, `Imperial BMI incorrect: got ${imperialBMI}`);

console.log("All BMI tests passed!");