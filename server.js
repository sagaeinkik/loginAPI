'use strict';

//Importer
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');
const cors = require('cors');

//parsing
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//port
const port = process.env.PORT || 3000;

//Databas-anslutning
const dbUrl = process.env.DB_URI;
mongoose
    .connect(dbUrl)
    .then(() => {
        console.log('Ansluten till MongoDB');
    })
    .catch((error) => {
        console.log(error);
    });

//Routes
//använd middleware-funktionerna som routes
app.use(authRoutes);
app.get('/', (req, res) => {
    res.json({
        message:
            'Välkommen till mitt API för Moment 4 i Backendbaserad webbutveckling på Mittuniversitetet. Instruktioner för användning hittar du på githubrepot (länka här)',
    });
});

//skyddad route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Access granted' });
});

//Tokenvalidering
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Själva token utan ord

    if (!token) return res.status(401).json({ message: 'Unauthorized, missing token' });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) return res.status(403).json({ message: 'Unauthorized, invalid token' });

        req.username = username;
        next();
    });
}

//Starta applikation
app.listen(port, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log('Ansluten till servern på port ' + port);
    }
});
