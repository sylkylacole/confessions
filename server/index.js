require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../public")));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      cb(null, `${timestamp}-${safeName}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "confessions_db",
};

async function initDb() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  await connection.end();

  const pool = mysql.createPool(dbConfig);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        confessID INT AUTO_INCREMENT PRIMARY KEY,
        confessText LONGTEXT NOT NULL,
        confessImg VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // If an older `confessions` table exists with data, don't drop it; optionally migrate later.
    // Ensure the `submissions` table has the expected columns when upgrading an existing DB
    try {
      await pool.query("ALTER TABLE submissions ADD COLUMN confessImg VARCHAR(255) NULL;");
    } catch (err) {
      if (err && err.errno && err.errno !== 1060) {
        throw err;
      }
    }
  return pool;
}

let pool;
initDb()
  .then((p) => {
    pool = p;
    console.log("Database initialized");
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

app.post("/api/confessions", upload.single("image"), async (req, res) => {
  try {
    const message = (req.body.message || "").trim();
    if (!message || message.length < 10) {
      return res.status(400).json({ error: "Message is required and must be at least 10 characters." });
    }

      const confessImg = req.file ? `/uploads/${req.file.filename}` : null;
      const [result] = await pool.query(
        "INSERT INTO submissions (confessText, confessImg) VALUES (?, ?)",
        [message, confessImg]
      );

    res.status(201).json({
      id: result.insertId,
      message,
      confessImg,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to save confession." });
  }
});

app.get("/api/confessions", async (req, res) => {
  try {
      const [rows] = await pool.query(
        "SELECT confessID AS id, confessText AS message, confessImg, created_at FROM submissions ORDER BY created_at DESC LIMIT 50"
      );
    // rows already have {id, message, confessImg, created_at}
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load confessions." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
