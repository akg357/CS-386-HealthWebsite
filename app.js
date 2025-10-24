import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcryptjs";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//paths for files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

const db = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/healthwebsite",
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error(" Database connection failed:", err.message));

//main page
app.get("/", async (req, res) => {
  try {
    let bmiHistory = [];
    if (req.session.userId) {
      const result = await db.query(
        "SELECT * FROM bmi_records WHERE user_id = $1 ORDER BY created_at DESC",
        [req.session.userId]
      );
      bmiHistory = result.rows;
    }

    res.render("index", { bmiHistory });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading page");
  }
});

//sign up
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashed]
    );

    req.session.userId = result.rows[0].id;
    req.session.user = { username: result.rows[0].username };
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Signup failed");
  }
});

//sign in
app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user.id;
      req.session.user = { username: user.username };
      res.redirect("/");
    } else {
      res.send("Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error signing in");
  }
});

//sign out
app.post("/signout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

//bmi calculations
app.post("/calculate-bmi", async (req, res) => {
  const { weight, height } = req.body;
  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

  if (!req.session.userId) return res.redirect("/signin");

  try {
    await db.query(
      "INSERT INTO bmi_records (user_id, weight, bmi) VALUES ($1, $2, $3)",
      [req.session.userId, weight, bmi]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving BMI record");
  }
});

//localhost3000
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
