const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://127.0.0.1:5501'
}));

app.use(bodyParser.json());

const db = new sqlite3.Database('db.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the users table if it does not exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            selectedCategories TEXT,
            favorites TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating users table', err.message);
            } else {
                console.log('Users table is ready.');
            }
        });
    }
});

app.post('/check-user', async (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (err) {
            // Send back an error in JSON format
            res.status(500).json({ success: false, userExists: false, message: 'Error querying the database' });
        } else if (row) {
            // User exists, check if the password is correct
            

            if (password !== row.password) {
                res.json({ success: true, userExists: true, message: 'User exists', passwordCorrect: false });                
            } else {
                res.json({ success: true, userExists: row.id, message: 'User exists', passwordCorrect: true });
            }
        } else {
            // Send back a successful response in JSON format
            res.json({ success: false, message: 'User does not exist' });
        }
    });
});



app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Check if user already exists
        db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, row) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error checking user existence.' });
            }
            if (row) {
                return res.status(409).json({ success: false, message: 'User already exists.' });
            }
            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run('INSERT INTO users(username, email, password) VALUES(?, ?, ?)', [username, email, password], function(err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error registering new user.' });
                }
                return res.status(201).json({ success: true, message: 'User registered successfully.' });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.post('/update-selected-categories', async (req, res) => {
    try {
        const { userId, selectedCategoryIds } = req.body;

        // Update the 'selectedCategories' column in the database for the authenticated user
        db.run('UPDATE users SET selectedCategories = ? WHERE id = ?', [selectedCategoryIds.join(','), userId], function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error updating selectedCategories in the database' });
            }
            return res.status(200).json({ success: true, message: 'Selected categories updated successfully.' });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
