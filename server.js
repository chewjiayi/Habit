const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database configuration info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialise express app
const app = express();
//help us read json
app.use(express.json());

//starting server
app.listen(port, () => console.log(`Server started on port ${port}`));

//get all eco green habit logs
app.get('/allhabits', async (req, res) => {
    try{
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.habit_tracker');
        res.json(rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allhabits'});
    }
});

//add eco green habit log
app.post('/addhabit', async (req, res) => {
    const { habit_name, activity_date, status } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO habit_tracker (habit_name, activity_date, status) VALUES (?,?,?)',
            [habit_name, activity_date, status]
        );
        res.status(201).json({message: habit_name + ' habit successfully added'});
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add ' + habit_name});
    }
});

//update eco green habit log
app.put('/updatehabit/:id', async (req, res) => {
    const { id } = req.params;
    const { habit_name, activity_date, status } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE habit_tracker SET habit_name = ?, activity_date = ?, status = ? WHERE id = ?',
            [habit_name, activity_date, status, id]
        );
        res.json({ message: 'Eco green habit tracker successfully updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update eco green habit tracker' });
    }
});

//delete eco green habit log
app.delete('/deletehabit/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM habit_tracker WHERE id = ?',
            [id]
        );
        res.json({ message: habit_name + ' habit successfully deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete ' + habit_name});
    }
});
