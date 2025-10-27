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

//retrieves the weight from the data table in bmi_records 
app.get("/current-weight", async (req, res) => {
    if(!req.session.userId) return res.redirect("/signin");

    //seach for the latest weight 
    try {
      const result = await db.query(
        "SELECT weight FROM bmi_records WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
        [req.session.userId]
      );
      
      //handles if there is no weight that exists 
      if (result.rows.length === 0) {
        return res.json({ weight: null });
      }

      //this returns the most recent weight 
      res.json({ weight: result.rows[0].weight });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching weight" });
    }
});


// notifications 
app.get("/notifications", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });

  try {
      const result = await db.query(
          "SELECT * FROM bmi_records WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE",
          [req.session.userId]
      );

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


//calcualte actual macros for desired weight 
async function calculateMacros() {
    const desiredWeight = document.getElementById("goalWeight").value;
    //will add pace functionality in the future 

    //check to make sure desired weight is a valid integer for calculation
    if (isNaN(desiredWeight) || desiredWeight <= 0) {
      alert("Please enter a valid weight");
      return null;
    }

    //retireves the weight of user from the data base 
    let currentWeight;
    try {
      const retrieval = await fetch("/current-weight");
      if(!retrieval.ok) throw new Error("No weight found");
      const data = await retrieval.json();
      currentWeight = parseFloat(data.weight);
  } catch (err) {
    console.error(err);
    alert("Error could not retireve weight from the database");
    return null
  }

  /*currently displaying weight based on their desired weight and if thats more or less then their current weight 
  these number can change this just made the most sense for now 
  also will need to update once the pace  functionality is implemented
  */
    let protein, carbs;
    if(desiredWeight > weight) {
      //trying to gain weight
      protein = (desiredWeight * 2.2);
      carbs = (desiredWeight * 5.0);
    } else if(desiredWeight < weight) {
      //trying to lose weight 
      protein = (desiredWeight * 1.8);
      carbs = (desiredWeight * 3.0)
    } else {
      //if weight the same then for maintance of current weight 
      protein = (desiredWeight * 2.0);
      carbs = (desiredWeight * 4.0);
    }

    document.getElementById("proteinPerDay").textContent = protein.toFixed(1);
    document.getElementById("carbsPerDay").textContent = carbs.toFixed(1);

    //return data so that it can be saved into the data table 
    return {
      weight: currentWeight,
      dersiredWeight,
      protein: protein,
      carbs: carbs
    }
}

function saveMacros(data) {
  //check to make sure data isnt null
  if (!data) return; 

  //sends the data to the back end 
  fetch("/calculate-goal-weight", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(data) // this converts the JS object to a JSON String 
  })
  .then(res => res.json())  // parse repsonse from server as JSON
  .then(response => console.log("Saved:", response.message)) //success message
  .catch(err => console.error("Error saving macros:", err)); //check for errors :(
}

//event listener for button updates front end while saving the data to the backend into new data table 
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnCalculate");
  if(!btn) {
    console.error("not found");
    return;
  }
  btn.addEventListener("click", async () => {
    console.log("button clicked");
    const data = await calculateMacros();
    console.log("Data collected: ", data);
    saveMacros(data);
  });
});


 

//store data into table 
app.post("/calculate-goal-weight", async (req, res) => {
  const { weight, desiredWeight, protein, carbs} = req.body; 

  if(!req.session.userId) return res.redirect("/signin");

  try{
    await db.query(
      "INSERT INTO desired-weight-records (user_id, weight, desired_weight, protein, carbs) VALUES ($1, $2, $3, $4, $5)",
      [req.session.userId, weight, desiredWeight, protein, carbs]
    );

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
