import calculateMacros from "../macros.js"; 

//test for case in gaining weight
let result = calculateMacros(70, 80);
assert.strictEqual(result.protein, 80 * 2.2);
assert.strictEqual(result.carbs, 80 * 5.0);

//test for case in losing weight
result = calculateMacros(80, 70);
assert.strictEqual(result.protein, 70 * 1.8);
assert.strictEqual(result.carbs, 70 * 3.0);

//test case in maintaing weight
result = calculateMacros(70, 70);
assert.strictEqual(result.protein, 70 * 2.0);
assert.strictEqual(result.carbs, 70 * 4.0);

console.log("all functions have passed");
