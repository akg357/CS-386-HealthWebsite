import request from "supertest";
import app from "../app.js"; // make sure your app exports the Express app

describe("Contact Form Feature", () => {
  it("should load the contact form page", async () => {
    const res = await request(app).get("/contact"); // update route if needed
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Contact"); // check that page contains "Contact"
  });
});
