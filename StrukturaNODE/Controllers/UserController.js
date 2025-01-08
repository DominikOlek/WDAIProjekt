const baza = require('../Controllers/DataBaseC.js');
const User = baza.User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var validator = require("email-validator");
const saltRounds = 10;

const register = (async (req, res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("Email") || !validator.validate(obj.Email) || !obj.hasOwnProperty("Password") || !obj.hasOwnProperty("Name") || !obj.hasOwnProperty("LastName")) {
            res.status(400).send("Missing data");
            return;
        }
        obj.Role = 'Employee';
        obj.Confirm = false;
        let isBe = await User.findOne({ where: { Email: obj.Email } });

        if (isBe != null) {
            res.status(406).send("An account with this email address already exists");
            return;
        }

        let hash = await hashpassword(obj.Password);
        if (hash == null) { res.status(500).json("Error with hashService"); return; }
        //let user = await User.create({ 'Name': obj.name, 'LastName': obj.name, 'Email': obj.name, 'Password': hash, 'Confirm': obj.name, 'Role': obj.name });
        obj.Password = hash;
        let user = await User.create(obj);
        if (!user) {
            res.status(503).json("Database error");
            return;
        }
        res.status(201).send("Account register, wait for confirm");
    } catch (error) {
        try { res.status(500).send(error); console.log("Error " + error); } catch { }
    }
});

const login = (async (req, res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("Email") || !obj.hasOwnProperty("Password") || !validator.validate(obj.Email)) {
            res.status(400).send("Missing data");
            return;
        }
        if (await User.count() == 0) {
            res.status(404).json("Wrong email or password");
            return;
        }
        let user = await User.findOne({ where: { Email: obj.Email } });
        if (!user || !user.Confirm) {
            res.status(404).json("This account is not confirm");
            return;
        }
        const result = await comparepassword(obj.Password, user.Password);
        if (!user || !result) {
            res.status(404).json("Wrong email or password");
            return;
        }
        let token = generateJWT(user);
        res.status(200).json(token);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
});

const confirm = (async (req,res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("ID")) {
            res.status(400).send("Missing data");
            return;
        }
        if (await User.count() == 0) {
            res.status(404).json("No data");
            return;
        }
        let user = await User.findOne({ where: { ID: obj.ID } });
        if (!user) {
            res.status(404).json("This account is not create");
            return;
        }
        await User.update({ 'Confirm': true }, { where: { ID: obj.ID } });
        res.status(200).json();
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
});

const setRole = (async (req, res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("ID"), !obj.hasOwnProperty("Role")) {
            res.status(400).send("Missing data");
            return;
        }
        if (obj.Role != 'Employee' && obj.Role != 'Manager') {
            res.status(406).json("Wrong role");
            return;
        }
        if (await User.count() == 0) {
            res.status(404).json("No data");
            return;
        }
        let user = await User.findOne({ where: { ID: obj.ID } });
        if (!user) {
            res.status(404).json("This account is not create");
            return;
        }
        await User.update({ 'Role': obj.Role }, { where: { ID: obj.ID } });
        res.status(200).json();
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
});

const getAllUser = async (req, res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("IsConfirm")) {
            res.status(400).send("Missing data");
            return;
        }
        let Users = await User.findAll({ attributes: ['Name', 'LastName','Email','Role'], where: { Confirm: obj.IsConfirm } });

        res.status(200).json(Users);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

function generateJWT(data) {
    const claims = { id: data.ID, username: data.Email, name: data.Name, lastname: data.LastName,role: data.Role};
    return jwt.sign(claims, process.env.TOKEN_SECRET, { expiresIn: '2000000s' }); //!!!DO TESTÓW
}


const hashpassword = async (haslo) => {
    try {
        const hashedPassword = await bcrypt.hash(haslo, saltRounds);
        return hashedPassword;
    } catch (error) {
        return null;
    }
}

const comparepassword = async (user, data) => {
    try {
        const result = await bcrypt.compare(user, data);
        return result;
    } catch (error) {
        return false;
    }
}

module.exports = { login, register, confirm, getAllUser ,setRole };