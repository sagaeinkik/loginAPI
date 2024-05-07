'use strict';
//Importer
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Skapa token!
const expirationDate = 60 * 60; //En timme
function createToken(username) {
    return jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: expirationDate });
}

//Registrera ny användare
module.exports.registerUser = async (req, res) => {
    //Error-meddelanden
    let errors = {
        https_response: {
            message: '',
            code: '',
        },
        message: '',
        details: '',
    };

    // req-innehåll:
    const { username, email, password } = req.body;

    try {
        //Kolla om användare redan finns, ge error då
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            errors.https_response.code = 400;
            errors.https_response.message = 'Bad request';
            errors.message = 'En användare finns redan med detta användarnamn och/eller e-post.';
            return res.status(400).json({ errors });
        }

        //Skapa annars ny användare med hjälp av req-bodyn
        const user = await User.create({ username, email, password });
        //skapa en token för inloggning direkt
        const token = createToken(user.username);
        //Lagra i cookie (*1000 för den har med milisekunder också)
        res.cookie('jwt', token, { maxAge: expirationDate * 1000 });
        res.status(200).json({ message: 'User created', user: user, token });
    } catch (error) {
        console.log('Något gick fel vid post signup: ' + error);
        return res.status(400).json({ error });
    }
};

//Logga in användare
module.exports.login = async (req, res) => {
    //Error-meddelanden
    let errors = {
        https_response: {
            message: '',
            code: '',
        },
        message: '',
        details: '',
    };
    //Lagra inloggningsuppgifterna
    const { username, password } = req.body;

    try {
        //använd login-metoden från userModel
        const user = await User.login(username, password);
        //Skapa token
        const token = createToken(user.username);
        res.cookie('jwt', token, { maxAge: expirationDate * 1000 });
        res.status(200).json({ message: 'User logged in', user: user, token });
    } catch (error) {
        console.log('Något gick fel vid post loginUser: ' + error);

        // Kontrollera om felet är användarnamn eller lösenord
        if (error instanceof Error && error.message === 'Felaktigt användarnamn eller lösenord') {
            errors.https_response.code = 400;
            errors.https_response.message = 'Bad request';
            errors.message = 'Felaktigt användarnamn eller lösenord';
            return res.status(400).json({ errors });
        } else {
            // Annars, generellt felmeddelande
            return res.status(400).json({ error });
        }
    }
};
