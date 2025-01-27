const mongoose = require('mongoose');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI 

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Define Exercise Schema
const exerciseSchema = new mongoose.Schema({
    name: String,
    target: String,
    bodyPart: String,
    equipment: String,
}, { strict: false });


const Exercise = mongoose.model('Exercise', exerciseSchema, 'exercises');

app.get('/api/exercises', async (req, res) => {
    try {
        const exercises = await Exercise.find({});
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/api/exercises/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json(exercise);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

app.get('/about', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
});

app.get('/uploadUser', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'user_upload_form.htm'));
});


app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
