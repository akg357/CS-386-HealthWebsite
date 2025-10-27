import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import oracledb from "oracledb";
import bcrypt from "bcryptjs";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//paths for files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Oracle DB connection setup
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

async function initOracle() {
  try {
    await oracledb.createPool(dbConfig);
    console.log("Connected to Oracle Database");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
}
initOracle();

// Helper to get connection
async function getConn() {
  return await oracledb.getConnection();
}

//main page
app.get("/", async (req, res) => {
  try {
    let bmiHistory = [];
    if (req.session.userId) {
      const conn = await getConn();
      const result = await conn.execute(
        `SELECT * FROM bmi_records WHERE user_id = :id ORDER BY created_at DESC`,
        [req.session.userId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      bmiHistory = result.rows;
      await conn.close();
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
    const conn = await getConn();
    const result = await conn.execute(
      `INSERT INTO users (username, password) VALUES (:username, :password) RETURNING id, username INTO :id, :uname`,
      {
        username,
        password: hashed,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        uname: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      }
    );

    await conn.commit();
    await conn.close();

    req.session.userId = result.outBinds.id[0];
    req.session.user = { username: result.outBinds.uname[0] };
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
    const conn = await getConn();
    const result = await conn.execute(
      `SELECT * FROM users WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();

    const user = result.rows[0];
    if (user && (await bcrypt.compare(password, user.PASSWORD))) {
      req.session.userId = user.ID;
      req.session.user = { username: user.USERNAME };
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
    const conn = await getConn();
    await conn.execute(
      `INSERT INTO bmi_records (user_id, weight, bmi) VALUES (:uid, :weight, :bmi)`,
      [req.session.userId, weight, bmi]
    );
    await conn.commit();
    await conn.close();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving BMI record");
  }
});

//retrieves the weight from the data table in bmi_records 
app.get("/current-weight", async (req, res) => {
  if (!req.session.userId) return res.redirect("/signin");

  //search for the latest weight 
  try {
    const conn = await getConn();
    const result = await conn.execute(
      `SELECT weight FROM bmi_records WHERE user_id = :id ORDER BY created_at DESC FETCH FIRST 1 ROWS ONLY`,
      [req.session.userId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();

    //handles if there is no weight that exists 
    if (result.rows.length === 0) {
      return res.json({ weight: null });
    }

    //this returns the most recent weight 
    res.json({ weight: result.rows[0].WEIGHT });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching weight" });
  }
});

// notifications 
app.get("/notifications", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });

  try {
    const conn = await getConn();
    const result = await conn.execute(
      `SELECT * FROM bmi_records WHERE user_id = :id AND TRUNC(created_at) = TRUNC(SYSDATE)`,
      [req.session.userId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.close();

    if (result.rows.length === 0) {
      return res.json({ notify: true, message: " No logged weight today!" });
    } else {
      return res.json({ notify: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error checking notifications" });
  }
});
//store data into table 
app.post("/calculate-goal-weight", async (req, res) => {
  const { weight, desiredWeight, protein, carbs } = req.body; 

  if (!req.session.userId) return res.redirect("/signin");

  try {
    const conn = await getConn();
    await conn.execute(
      `INSERT INTO desired_weight_records (user_id, weight, desired_weight, proteins, carbs)
       VALUES (:uid, :weight, :desiredWeight, :protein, :carbs)`,
      [req.session.userId, weight, desiredWeight, protein, carbs]
    );
    await conn.commit();
    await conn.close();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving Desired Weight record");
  }
});

//localhost3000
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
