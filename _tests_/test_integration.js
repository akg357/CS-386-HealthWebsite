import assert from "assert";
import { JSDOM } from "jsdom";
import fs from "fs";

describe("Integration Tests", function() {
  it("should calculate BMI and Macros correctly", async function() {
    //html
    const html = fs.readFileSync("./index.html", "utf8");
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
    });

    const { window } = dom;
    const { document } = window;

    //alert
    window.alert = () => {};

    //js files
    let mainScript = fs.readFileSync("./main.js", "utf8");
    mainScript = mainScript.replace(/export /g, ""); // remove export keyword
    window.eval(mainScript);

    let macroScript = fs.readFileSync("./macros.js", "utf8");
    macroScript = macroScript.replace(/export /g, "");
    window.eval(macroScript);

    //wait for scripts
    await new Promise(res => setTimeout(res, 50));

    //test bmi
    document.body.innerHTML = `
      <input id="height" value="180" />
      <input id="weight" value="75" />
      <select id="heightUnit"><option value="cm" selected></option></select>
      <select id="weightUnit"><option value="kg" selected></option></select>
      <div id="bmiResult"></div>
    `;

    //bmi function
    window.calculateBMI();

    const bmiText = document.getElementById("bmiResult").textContent;
    assert.ok(bmiText.includes("23.15"), "BMI calculation integration failed");

    //test
    document.body.innerHTML = `
      <input id="goalWeight" value="180" />
      <div id="proteinPerDay"></div>
      <div id="carbsPerDay"></div>
    `;

    //functions
    window.calculateMacros();

    assert.strictEqual(document.getElementById("proteinPerDay").textContent, "324.0");
    assert.strictEqual(document.getElementById("carbsPerDay").textContent, "540.0");

    console.log("Integration test passed!");
  });
});
