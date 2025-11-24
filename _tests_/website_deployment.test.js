
describe("Website deployment", () => {
    test("Website should respond with status 200", async () => {
        const response = await fetch("https://cs-386-healthwebsite.netlify.app/");
        expect(response.status).toBe(200);
    });

    test("Website should contain expected text", async () => {
        const response = await fetch("https://cs-386-healthwebsite.netlify.app/");
        const text = await response.text();
        expect(text).toContain("Health Helper");
    });
});