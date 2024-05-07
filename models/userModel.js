'use strict';

//Importer
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

//Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Ange ditt namn'],
        unique: [true, 'Detta användarnamn är upptaget'],
    },
    email: {
        type: String,
        required: [true, 'Ange en giltig email-adress'],
        unique: [true, 'Denna email-adress finns redan registrerad'],
        lowercase: true,
        validate: isEmail,
    },
    password: {
        type: String,
        required: [true, 'Ange ett lösenord'],
        minLength: [5, 'Ditt lösenord måste vara minst 5 tecken långt'],
    },
    registeredDate: {
        type: Date,
        default: Date.now,
    },
});

//Kryptera lösenord innan det lagras
userSchema.pre('save', async function (next) {
    try {
        if (this.isNew || this.isModified('password')) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }

        next();
    } catch (error) {
        next(error);
    }
});

//Metod för att logga in användare
userSchema.statics.login = async function (username, password) {
    //Hitta använare
    const user = await this.findOne({ username });
    if (user) {
        //Jämför lösenord
        const authorized = await bcrypt.compare(password, user.password);

        if (authorized) {
            //Returnera användare om lyckat
            return user;
        }
        //Error för fel lösenord
        throw Error('Felaktigt användarnamn eller lösenord');
    }
    //Error för fel användare
    throw Error('Felaktigt användarnamn eller lösenord');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
