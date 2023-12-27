const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const port = 3000;

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',  // assuming MySQL is running on the same machine
    user: 'root',       // default MySQL user in XAMPP
    password: '',       // default MySQL password in XAMPP
    database: 'MyWebSite',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, 'html')));

// Handle root URL
app.get('/', (req, res) => {
    // Send the index.html file
    res.sendFile(path.join(__dirname, 'html','index.html'));
});
// Add this route in your server.js file
app.get('/ForgetPassword.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'ForgetPassword.html'));
});
// Handle login form submission
app.post('/login', async (req, res) => {
    const { Username, Password, Date } = req.body;
    const passwordfiled = req.body.Password;
    try {
        const hashedPassword = await bcrypt.hash(passwordfiled, 10);
        // SQL query to insert data into the database
        const sql = 'INSERT INTO Users (Username, Password, Date) VALUES (?, ?, CURRENT_TIMESTAMP)';
        db.query(sql, [Username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting into MySQL:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log('New record created successfully');
                res.json({ message: 'New record created successfully' });
            }
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Handle forgot password form submission
app.post('/forgotPassword', (req, res) => {
    const { email, phoneNumber, birthday } = req.body;

    // SQL query to insert data into the ForgetUsers table
    const sql = 'INSERT INTO ForgetUsers (email, phoneNumber, birthday, submission_date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)';
    db.query(sql, [email, phoneNumber, birthday], (err, result) => {
        if (err) {
            console.error('Error inserting into MySQL:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('New record created successfully');
            res.json({ message: 'New record created successfully' });
        }
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});