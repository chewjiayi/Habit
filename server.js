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
// CRUD (Done by Entong)
//get all eco green habit logs
app.get('/allhabits', async (req, res) => {
    try{
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM habits');
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
            'INSERT INTO habits (habit_name, activity_date, status) VALUES (?,?,?)',
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
            'UPDATE habits SET habit_name = ?, activity_date = ?, status = ? WHERE id = ?',
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
            'DELETE FROM habits WHERE id = ?',
            [id]
        );
        res.json({ message: habit_name + ' habit successfully deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete ' + habit_name});
    }
});

//CRUD for Activities (Jiayi)

// get all eco green activities
app.get('/allactivities', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM activities'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allactivities' });
    }
});
// get activities by habit id
app.get('/activities/:habit_id', async (req, res) => {
    const { habit_id } = req.params;

    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM activities WHERE habit_id = ?',
            [habit_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for activities by habit' });
    }
});
// add eco green activity
app.post('/addactivity', async (req, res) => {
    const { habit_id, activity_date, duration_minutes, notes } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO activities (habit_id, activity_date, duration_minutes, notes) VALUES (?,?,?,?)',
            [habit_id, activity_date, duration_minutes, notes]
        );
        res.status(201).json({ message: 'Activity successfully added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add activity' });
    }
});
// update eco green activity
app.put('/updateactivity/:id', async (req, res) => {
    const { id } = req.params;
    const { habit_id, activity_date, duration_minutes, notes } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE activities SET habit_id = ?, activity_date = ?, duration_minutes = ?, notes = ? WHERE id = ?',
            [habit_id, activity_date, duration_minutes, notes, id]
        );
        res.json({ message: 'Activity successfully updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update activity' });
    }
});
// delete eco green activity
app.delete('/deleteactivity/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM activities WHERE id = ?',
            [id]
        );
        res.json({ message: 'Activity successfully deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete activity' });
    }
});

