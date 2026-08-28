# Book Tracker REST API

A REST API for managing and tracking books using Node.js, Express, and PostgreSQL.

## Features

The API supports:

- Filtering books using GET requests
- Adding new books using POST requests
- Updating existing books using PUT requests
- PostgreSQL database integration
- JSON request and response data

## API Endpoints

### GET Books

GET /api/v1/books

Returns all books.

Books can also be filtered using query parameters.

Example:

GET /api/v1/books?genre=Fantasy

GET /api/v1/books?status=Completed

### POST Book

POST /api/v1/books

Adds a new book to the database.

Example JSON body:

{
  "title": "Project Hail Mary",
  "author": "Andy Weir",
  "genre": "Science Fiction",
  "reading_status": "Want to Read",
  "rating": 5,
  "notes": "Added through the POST endpoint."
}

### PUT Book

PUT /api/v1/books/:id

Updates an existing book by its book ID.

Example:

PUT /api/v1/books/6

## Setup Instructions

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a PostgreSQL database.
4. Configure the required database environment variables in a `.env` file.
5. Run `node app.js` to start the server.
6. The API will run locally at `http://localhost:3000`.

## Technologies Used

- Node.js
- Express
- PostgreSQL
- Postman
- GitHub
- Render