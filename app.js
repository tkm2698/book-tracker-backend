require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL
    })
    : new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Book Tracker API"
    });
});

// GET all books
app.get("/api/books", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM books ORDER BY book_id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database query failed"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Book Tracker API running at http://localhost:${PORT}`);
});