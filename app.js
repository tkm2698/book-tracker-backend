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

// GET books with optional filters
app.get("/api/v1/books", async (req, res) => {
    try {
        const { genre, status } = req.query;

        let query = "SELECT * FROM books";
        const values = [];
        const conditions = [];

        if (genre) {
            values.push(genre);
            conditions.push(`genre = $${values.length}`);
        }

        if (status) {
            values.push(status);
            conditions.push(`reading_status = $${values.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY book_id";

        const result = await pool.query(query, values);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database query failed"
        });
    }
});
// POST a new book
app.post("/api/v1/books", async (req, res) => {
    try {
        const {
            title,
            author,
            genre,
            reading_status,
            rating,
            notes
        } = req.body;

        const result = await pool.query(
            `INSERT INTO books
            (title, author, genre, reading_status, rating, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [title, author, genre, reading_status, rating, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to add book"
        });
    }
});
// PUT - update an existing book
app.put("/api/v1/books/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            author,
            genre,
            reading_status,
            rating,
            notes
        } = req.body;

        const result = await pool.query(
            `UPDATE books
             SET title = $1,
                 author = $2,
                 genre = $3,
                 reading_status = $4,
                 rating = $5,
                 notes = $6
             WHERE book_id = $7
             RETURNING *`,
            [
                title,
                author,
                genre,
                reading_status,
                rating,
                notes,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update book"
        });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Book Tracker API running at http://localhost:${PORT}`);
});