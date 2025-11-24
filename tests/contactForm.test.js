import request from "supertest";
import app from "../app.js"; 

describe("Contact Form Feature", () => {
  it("should load the contact form page", async () => {
    const res = await request(app).get("/contact"); 
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Contact"); 
  });
});
