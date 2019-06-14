const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

//CODING CONVENTION router name will be plural, model and controller name will be singular
// Will use camel-case convention for declaring variable and functions
//For Schema Design Multiple Word Property will declare such a way is_active [underscore will be the separator]
// Sometimes we don't need a table rather we need a Schema that's why I created Schema folder
// We should never store the token in the database.
// We don't need any individual routes for logout because we are not saving the token anywhere in the server. just need to delete the token from client

//CONFIG
const config = require('./config');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answer');
const articleRoutes = require('./routes/articles');
const departmentRoutes = require('./routes/departments');
const emailRoutes = require('./routes/emails');
const linkRoutes = require('./routes/links');
const employeeRoutes = require('./routes/employees');
const industryRoutes = require('./routes/industries');
const organizationRoutes = require('./routes/organizations');
const pageRoutes = require('./routes/pages');
const surveyRoutes = require('./routes/surveys');
const clientRoutes = require('./routes/clients');
const divisionRoutes = require('./routes/divisions');
const roleRoutes = require('./routes/roles');
const boxRoutes = require('./routes/boxs');
const categoryRoutes = require('./routes/categories');

//Connect with the mongodb database
mongoose.connect(config.MONGO_URI, {useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log('could not connect', error));


//Multer File Upload Set UP
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});

//filter the file by it's type
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

//body-parser configuration for reading data from request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); // x-www-form-urlencoded

//Multer Middleware for file upload
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'public')));

//SET UP ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/surveys', surveyRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/answers', answerRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/emails', emailRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/links', linkRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/pages', pageRoutes);
app.use('/api/v1/industries', industryRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/divisions', divisionRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/boxes', boxRoutes);
app.use('/api/v1/categories', categoryRoutes);

//Angular DIST output folder
const appPath = path.join(__dirname, '..', 'dist');
app.use(express.static(appPath));

// Serve the Angular index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(appPath, 'index.html'))
});

//Middleware function for handling error
//This Middleware function will execute if any error is thrown
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    console.log('something is printing');
    res.status(status).json({message, success: false})
});


app.listen(8080, () => {
    console.log('server is running')
});