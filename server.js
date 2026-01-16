const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

// GET ALL HABITS
app.get("/habits", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute("SELECT * FROM habits");
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET HABIT BY ID
app.get("/habits/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM habits WHERE id = ?",
      [id]
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
app.post("/habits", async (req, res) => {
  const { habit_name, category, points } = req.body;
  if (!habit_name || !category || points === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "INSERT INTO habits (habit_name, category, points) VALUES (?, ?, ?)",
      [habit_name, category, points]
    );
    await connection.end();
    res.json({ message: "Habit added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT
app.put("/habits/:id", async (req, res) => {
  const { habit_name, category, points } = req.body;
  const { id } = req.params;

  if (!habit_name || !category || points === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      "UPDATE habits SET habit_name=?, category=?, points=? WHERE id=?",
      [habit_name, category, points, id]
    );
    await connection.end();
    res.json({ message: "Habit updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/habits/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("DELETE FROM habits WHERE id=?", [id]);
    await connection.end();
    res.json({ message: "Habit deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Habit web service running on port ${PORT}`);
});
