const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '168179', 
    database: 'formdata' 
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
    
    // Create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            number VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL
        )
    `;
    db.query(createTableQuery, err => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Database and table created or already exist');
    });
});


app.post('/data', (req, res) => {
    const { name, number, email } = req.body;
    console.log(req.body);

    const insertQuery = 'INSERT INTO data (name, number, email) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, number, email], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        res.status(201).send('Data Received');
    });
});


app.get('/data', (req, res) => {
    const selectQuery = 'SELECT * FROM data';
    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.status(200).json(results);
    });
});

app.delete('/data/:id', (req, res) => {
    const { id } = req.params;

  
    const deleteQuery = 'DELETE FROM data WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.status(200).send('Data Deleted');
    });
});

app.patch('/data/:id', (req, res) => {
    const { id } = req.params;
    const { name, number, email } = req.body;

    console.log(`PATCH request received for ID: ${id}`);
    console.log(`Data to update: ${name}, ${number}, ${email}`);

    const updateQuery = 'UPDATE data SET name = ?, number = ?, email = ? WHERE id = ?';
    db.query(updateQuery, [name, number, email, id], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.status(200).send('Data Updated');
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
