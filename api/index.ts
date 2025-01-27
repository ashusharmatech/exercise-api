const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware configuration - this should come before routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout for MongoDB connection
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure if MongoDB is not reachable
});

// Define Exercise Schema
const exerciseSchema = new mongoose.Schema({
    name: String,
    target: String,
    bodyPart: String,
    equipment: String,
}, { strict: false });

const Exercise = mongoose.model('Exercise', exerciseSchema, 'exercises');

// API Routes
app.get('/api/exercises', async (req, res) => {
    const startTime = Date.now(); // Start timer for debugging

    try {
        console.log('Fetching all exercises...'); // Log query start

        const exercises = await Exercise.find({});
        
        if (!exercises || exercises.length === 0) {
            return res.status(404).json({ message: 'No exercises found' });
        }

        const endTime = Date.now(); // End timer
        console.log(`Fetched ${exercises.length} exercises in ${endTime - startTime}ms`); // Log execution time

        res.json(exercises);
    } catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/exercises/:id', async (req, res) => {
    const startTime = Date.now(); // Start timer for debugging

    try {
        console.log(`Fetching exercise with ID: ${req.params.id}`); // Log query start
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid exercise ID' });
        }

        const exercise = await Exercise.findById(req.params.id);
        
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        const endTime = Date.now(); // End timer
        console.log(`Fetched exercise in ${endTime - startTime}ms`); // Log execution time

        res.json(exercise);
    } catch (error) {
        console.error('Error fetching exercise:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Static Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
});

app.get('/uploadUser', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'components', 'user_upload_form.htm'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));

module.exports = app;
