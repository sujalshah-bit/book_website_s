require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions))
// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'myuser',
    password: 'mypassword',
    database: 'mydb',
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize Database
const initializeDatabase = () => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected to MySQL...');

        const sql = `
    CREATE DATABASE IF NOT EXISTS mydb;
    USE mydb;

    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        url VARCHAR(255),
        rating FLOAT,
        description TEXT,
        image_url VARCHAR(255),
        categories JSON
    );

    CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        admin_id INT NULL,
        book_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        admin_id INT NULL,
        book_id INT NOT NULL,
        rating FLOAT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        admin_id INT NULL,
        book_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        admin_id INT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS book_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        admin_id INT NULL,
        book_id INT NOT NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );
`;

        connection.query(sql, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) throw err;
            console.log('Database and tables created...');
        });
    });
};

// Call the function to initialize the database
initializeDatabase();

// Port
const PORT = 5000;

// Middleware to verify token
const verifyToken = (req, res, next) => {
    // Try to extract the token from cookies or the Authorization header
    const token = req.cookies['token'] || req.headers['authorization']?.split(' ')[1]; // Split to remove "Bearer"
    if (!token) {
        return res.status(403).send('Token is required');
    }

    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).send('Invalid Token');
    }
};

// Middleware to check if admin
const isAdmin = (req, res, next) => {
    // console.log(req.user)
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    next();
};


app.get('/', (re, res) => {

})

// Admin and User Routes

// User Signup
app.post('/user/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Please provide username and password');
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const checkUserSql = 'SELECT * FROM users WHERE username = ?';
        connection.query(checkUserSql, [username], (err, results) => {
            if (err) {
                connection.release();
                throw err;
            }

            if (results.length > 0) {
                connection.release();
                return res.status(400).send('User already exists');
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    connection.release();
                    throw err;
                }

                const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
                connection.query(insertUserSql, [username, hashedPassword], (err, result) => {
                    connection.release();
                    if (err) throw err;
                    res.status(201).json({ msg: 'User registered' });
                });
            });
        });
    });
});

// Admin Signup
app.post('/admin/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Please provide username and password');
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const checkAdminSql = 'SELECT * FROM admins WHERE username = ?';
        connection.query(checkAdminSql, [username], (err, results) => {
            if (err) {
                connection.release();
                throw err;
            }

            if (results.length > 0) {
                connection.release();
                return res.status(400).send('Admin already exists');
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    connection.release();
                    throw err;
                }

                const insertAdminSql = 'INSERT INTO admins (username, password) VALUES (?, ?)';
                connection.query(insertAdminSql, [username, hashedPassword], (err, result) => {
                    connection.release();
                    if (err) throw err;
                    res.status(201).json({ msg: 'Admin registered' });
                });
            });
        });
    });
});

// User and Admin Login
app.post('/login', (req, res) => {
    const { username, password, role } = req.body; // Role must be passed as 'user' or 'admin'

    if (!username || !password || !role) {
        return res.status(400).send('Please provide username, password, and role');
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const table = role === 'admin' ? 'admins' : 'users';
        const sql = `SELECT * FROM ${table} WHERE username = ?`;

        connection.query(sql, [username], (err, results) => {
            if (err) {
                connection.release();
                throw err;
            }

            if (results.length === 0) {
                connection.release();
                return res.status(400).send(`${role} not found`);
            }

            const user = results[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    connection.release();
                    throw err;
                }

                if (!isMatch) {
                    connection.release();
                    return res.status(400).send('Incorrect password');
                }

                const token = jwt.sign({ id: user.id, role }, 'secretkey', { expiresIn: '1h' });
                connection.release();
                res.cookie('token', token, { httpOnly: false, secure: true, maxAge: 3600000 });
                res.json({ message: 'Logged in successfully' });
            });
        });
    });
});

// Book Routes

// Get all books with comments and ratings
app.get('/books', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = `
            SELECT 
                b.id, b.title, b.author, b.price, b.url, b.rating, b.description, b.image_url, b.categories,
                JSON_ARRAYAGG(JSON_OBJECT('author', COALESCE(u.username, a.username), 'comment', c.comment)) AS comments
            FROM books b
            LEFT JOIN comments c ON b.id = c.book_id
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN admins a ON c.admin_id = a.id
            GROUP BY b.id
        `;

        connection.query(sql, (err, results) => {
            connection.release();
            if (err) throw err;
            res.json(results); // Send all books with grouped comments
        });
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: false, secure: true });
    res.status(200).json({ message: 'Logged out successfully' });
});


// Add a book (Admin only)
app.post('/books', verifyToken, isAdmin, (req, res) => {
    const { title, author, price, url, rating, description, image_url, categories } = req.body;

    if (!title || !author || !price) {
        return res.status(400).send('Please provide title, author, and price');
    }

    const categoriesJson = JSON.stringify(categories);

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'INSERT INTO books (title, author, price, url, rating, description, image_url, categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [title, author, price, url, rating, description, image_url, categoriesJson], (err, result) => {
            connection.release();
            if (err) throw err;
            res.status(201).send('Book added');
        });
    });
});

app.get('/book/:id', (req, res) => {
    const bookId = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = `
            SELECT 
                b.id, b.title, b.author, b.price, b.url, b.rating, b.description, b.image_url, b.categories,
                JSON_ARRAYAGG(JSON_OBJECT('author', COALESCE(u.username, a.username), 'comment', c.comment)) AS comments
            FROM books b
            LEFT JOIN comments c ON b.id = c.book_id
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN admins a ON c.admin_id = a.id
            WHERE b.id = ?
            GROUP BY b.id
        `;

        connection.query(sql, [bookId], (err, results) => {
            connection.release();
            if (err) throw err;

            if (results.length === 0) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.json(results[0]); // Send the book data with comments array
        });
    });
});



// Update a book (Admin only)
app.put('/books/:id', verifyToken, isAdmin, (req, res) => {
    const { title, author, price, url, rating, description, image_url, categories } = req.body;
    const { id } = req.params;

    const categoriesJson = JSON.stringify(categories);

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'UPDATE books SET title = ?, author = ?, price = ?, url = ?, rating = ?, description = ?, image_url = ?, categories = ? WHERE id = ?';
        connection.query(sql, [title, author, price, url, rating, description, image_url, categoriesJson, id], (err, result) => {
            connection.release();
            if (err) throw err;
            res.send('Book updated');
        });
    });
});

// Delete a book (Admin only)
app.delete('/books/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'DELETE FROM books WHERE id = ?';
        connection.query(sql, [id], (err, result) => {
            connection.release();
            if (err) throw err;
            res.send('Book deleted');
        });
    });
});

// Comment Routes

// Add a comment (User or Admin)
app.post('/books/:book_id/comments', verifyToken, (req, res) => {
    const { comment } = req.body;
    const { book_id } = req.params;
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'INSERT INTO comments (user_id, admin_id, book_id, comment) VALUES (?, ?, ?, ?)';
        connection.query(sql, [user_id, admin_id, book_id, comment], (err, result) => {
            connection.release();
            if (err) throw err;
            // console.log(result)
            res.status(201).send('Comment added');
        });
    });
});

// Rating Routes

// Add a rating (User or Admin)
app.post('/books/:book_id/ratings', verifyToken, (req, res) => {
    const { rating } = req.body;
    const { book_id } = req.params;
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;

    // Validate rating value
    const numericRating = parseFloat(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
            error: 'Rating must be a number between 1 and 5'
        });
    }

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'INSERT INTO ratings (user_id, admin_id, book_id, rating) VALUES (?, ?, ?, ?)';
        connection.query(sql, [user_id, admin_id, book_id, numericRating], (err, result) => {
            connection.release();
            if (err) {
                console.error('Rating error:', err);
                return res.status(500).json({
                    error: 'Failed to add rating. Rating must be between 1 and 5.'
                });
            }
            res.status(201).json({ message: 'Rating added successfully' });
        });
    });
});

// Get all ratings for a specific book
app.get('/books/:book_id/ratings', (req, res) => {
    const { book_id } = req.params;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = `
            SELECT r.id, r.rating, r.created_at, 
                u.username AS user_name, 
                a.username AS admin_name
            FROM ratings r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN admins a ON r.admin_id = a.id
            WHERE r.book_id = ?`;

        connection.query(sql, [book_id], (err, results) => {
            connection.release();
            if (err) throw err;
            res.json(results);
        });
    });
});


// Check if the user or admin has already rated a book
app.get('/check-already-rated/:book_id/ratings', verifyToken, (req, res) => {
    const { book_id } = req.params;
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;
    // console.log({book_id, user_id, admin_id})

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'SELECT * FROM ratings WHERE (user_id = ? OR admin_id = ?) AND book_id = ?';
        connection.query(sql, [user_id, admin_id, book_id], (err, results) => {
            connection.release();
            if (err) throw err;
            if (results.length > 0) {
                res.status(200).json({ alreadyRated: true });
            } else {
                res.status(200).json({ alreadyRated: false });
            }
        });
    });
});

//check adming
app.get('/check-admin', verifyToken, isAdmin, (req, res) => {
    res.status(201).send("Admin")
});

// Feedback Routes

// Add website feedback (User or Admin)
app.post('/feedback', verifyToken, (req, res) => {
    const { feedback, title } = req.body;
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'INSERT INTO feedback (user_id, admin_id, description, title) VALUES (?, ?, ?, ?)';
        connection.query(sql, [user_id, admin_id, feedback, title], (err, result) => {
            connection.release();
            if (err) throw err;
            res.status(201).send('Feedback added');
        });
    });
});

// Get feedback (Admin only)
app.get('/feedback', verifyToken, isAdmin, (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'SELECT * FROM feedback';
        connection.query(sql, (err, results) => {
            connection.release();
            if (err) throw err;
            res.json(results);
        });
    });
});

// Wishlist Routes

// Add book to wishlist (User or Admin)
app.post('/wishlist', verifyToken, (req, res) => {
    const { book_id } = req.body;
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'INSERT INTO wishlists (user_id, admin_id, book_id) VALUES (?, ?, ?)';
        connection.query(sql, [user_id, admin_id, book_id], (err, result) => {
            connection.release();
            if (err) throw err;
            res.status(201).send('Book added to wishlist');
        });
    });
});

// Get wishlist (User or Admin)
app.get('/wishlist', verifyToken, (req, res) => {
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'SELECT b.* FROM books b JOIN wishlists w ON b.id = w.book_id WHERE w.user_id = ? OR w.admin_id = ?';
        connection.query(sql, [user_id, admin_id], (err, results) => {
            connection.release();
            if (err) throw err;
            res.json(results);
        });
    });
});

// Remove book from wishlist (User or Admin)
app.delete('/wishlist/:book_id', verifyToken, (req, res) => {
    const { book_id } = req.params;
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'DELETE FROM wishlists WHERE (user_id = ? OR admin_id = ?) AND book_id = ?';
        connection.query(sql, [user_id, admin_id, book_id], (err, result) => {
            connection.release();
            if (err) throw err;

            if (result.affectedRows === 0) {
                return res.status(404).send('Book not found in wishlist');
            }

            res.status(200).send('Book removed from wishlist');
        });
    });
});

// Track book view
app.post('/books/:book_id/view', verifyToken, (req, res) => {
    const { book_id } = req.params;
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'INSERT INTO book_views (user_id, admin_id, book_id) VALUES (?, ?, ?)';
        connection.query(sql, [user_id, admin_id, book_id], (err, result) => {
            connection.release();
            if (err) throw err;
            res.status(201).send('View recorded');
        });
    });
});

// Enhanced recommendation endpoint
app.get('/recommendations', verifyToken, async (req, res) => {
    const user_id = req.user.role === 'user' ? req.user.id : null;
    const admin_id = req.user.role === 'admin' ? req.user.id : null;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        // First, check if we have any interactions
        connection.query(
            `SELECT COUNT(*) as count FROM book_views WHERE user_id = ? OR admin_id = ?`,
            [user_id, admin_id],
            (err, viewResults) => {
                if (err) {
                    connection.release();
                    throw err;
                }
                console.log({viewResults})
                // If user has no views, return top rated and most viewed books
                if (viewResults[0].count === 0) {
                    const popularBooksSQL = `
                        SELECT b.*, 
                            (SELECT COUNT(*) FROM book_views WHERE book_id = b.id) as view_count,
                            (SELECT AVG(rating) FROM ratings WHERE book_id = b.id) as avg_rating
                        FROM books b
                        ORDER BY avg_rating DESC, view_count DESC
                        LIMIT 6
                    `;

                    connection.query(popularBooksSQL, (err, results) => {
                        connection.release();
                        if (err) throw err;
                        res.json(results);
                    });
                    return;
                }

                // Modified recommendation query to properly handle JSON
                const recommendationSQL = `
                    WITH TopViewedBooks AS (
                        SELECT 
                            book_id,
                            COUNT(*) as view_count
                        FROM book_views
                        GROUP BY book_id
                        ORDER BY view_count DESC
                        LIMIT 5
                    ),
                    CommonCategories AS (
                        SELECT 
                            JSON_UNQUOTE(categories.category) as category,
                            COUNT(*) as category_count
                        FROM TopViewedBooks tv
                        JOIN books b ON tv.book_id = b.id
                        CROSS JOIN JSON_TABLE(
                            b.categories,
                            '$[*]' COLUMNS (category VARCHAR(255) PATH '$')
                        ) categories
                        WHERE JSON_UNQUOTE(categories.category) != 'Books'
                        GROUP BY categories.category
                        ORDER BY category_count DESC
                        LIMIT 1
                    )
                    SELECT DISTINCT b.*
                    FROM books b
                    CROSS JOIN CommonCategories cc
                    JOIN JSON_TABLE(
                        b.categories,
                        '$[*]' COLUMNS (category VARCHAR(255) PATH '$')
                    ) book_cats
                    WHERE JSON_UNQUOTE(book_cats.category) = cc.category
                    ORDER BY RAND()
                    LIMIT 3
                `;

                connection.query(recommendationSQL, (err, results) => {
                    if (err) throw err;
                    console.log('Recommended books:', results);
                    res.json(results);
                });
            }
        );
    });
});

// Get similar books based on categories
app.get('/books/:book_id/recommendations', (req, res) => {
    const { book_id } = req.params;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        // First, get the categories of the current book
        const getCategoriesSql = 'SELECT categories FROM books WHERE id = ?';

        connection.query(getCategoriesSql, [book_id], (err, results) => {
            if (err) {
                connection.release();
                throw err;
            }

            if (results.length === 0) {
                connection.release();
                return res.status(404).json({ message: 'Book not found' });
            }

            const currentBookCategories = JSON.parse(results[0].categories);

            // Then, find books with similar categories, excluding the current book
            const getRecommendationsSql = `
                SELECT DISTINCT b.*
                FROM books b
                WHERE b.id != ?
                AND JSON_OVERLAPS(b.categories, ?)
                ORDER BY b.rating DESC
                LIMIT 5
            `;

            connection.query(getRecommendationsSql, [book_id, JSON.stringify(currentBookCategories)], (err, recommendations) => {
                connection.release();
                if (err) throw err;
                console.log({recommendations})
                res.json(recommendations);
            });
        });
    });
});

// Server Listening
app.listen(PORT, () => {
    console.log('Server running on port: 5000');
});

