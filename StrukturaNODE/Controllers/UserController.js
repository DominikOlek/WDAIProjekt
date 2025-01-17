const baza = require("../Controllers/DataBaseC.js");
const User = baza.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var validator = require("email-validator");
const saltRounds = 10;

const register = async (req, res) => {
  try {
    const obj = req.body;
    if (
      !obj.hasOwnProperty("Email") ||
      !validator.validate(obj.Email) ||
      !obj.hasOwnProperty("Password") ||
      !obj.hasOwnProperty("Name") ||
      !obj.hasOwnProperty("LastName")
    ) {
      return res.status(400).send("Missing data");
    }
    obj.Role = "Employee";
    obj.Confirm = false;
    let isBe = await User.findOne({ where: { Email: obj.Email } });

    if (isBe != null) {
      return res
        .status(406)
        .send("An account with this email address already exists");
    }

    let hash = await hashpassword(obj.Password);
    if (hash == null) {
      res.status(500).json("Error with hashService");
      return;
    }
    //let user = await User.create({ 'Name': obj.name, 'LastName': obj.name, 'Email': obj.name, 'Password': hash, 'Confirm': obj.name, 'Role': obj.name });
    obj.Password = hash;
    let user = await User.create(obj);
    if (!user) {
      return res.status(503).json("Database error");
    }
    res.status(201).send("Account register, wait for confirm");
  } catch (error) {
    try {
      res.status(500).send(error);
      console.log("Error " + error);
    } catch {}
  }
};

const login = async (req, res) => {
  console.log(req.body);
  console.log("login");
  try {
    const obj = req.body;
    if (!obj.hasOwnProperty("Password")) {
      return res.status(400).send("Missing password");
    }
    if (!obj.hasOwnProperty("Email")) {
      return res.status(400).send("Missing email");
    }

    if (!validator.validate(obj.Email)) {
      return res.status(400).send("Email not valid");
    }
    if ((await User.count()) == 0) {
      return res.status(404).json("Wrong email or password");
    }
    let user = await User.findOne({ where: { Email: obj.Email } });
    if (!user || !user.Confirm) {
      return res.status(404).json("This account is not confirm");
    }
    const result = await comparepassword(obj.Password, user.Password);
    if (!user || !result) {
      return res.status(404).json("Wrong email or password");
    }
    let token = generateJWT(user);
    let refresh = generateRefresh(user);
    User.update({ Refresh: refresh }, { where: { Email: obj.Email } });
    res.status(200).json({ token, refresh });
  } catch (error) {
    try {
      res.status(500).send();
      console.log("Error " + error);
    } catch {}
  }
};

const refresh = async (req, res) => {
  try {
    const obj = req.body;
    const user = req.user;

    if (!obj.hasOwnProperty("Refresh")) {
      return res.status(400).send("Missing data");
    }
    const token = obj.Refresh;

    let check = await User.findOne({ where: { Refresh: token } });

    if (token == null || check == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.TOKEN_REFRESH, (err, user) => {
      if (err) return res.sendStatus(403);
      let refresh = generateRefresh(check);
      let token = generateJWT(check);
      User.update({ Refresh: refresh }, { where: { Email: check.Email } });
      return res.status(200).json({ token, refresh });
    });
    return res.sendStatus(401);
  } catch (error) {
    try {
      res.status(500).send();
      console.log("Error " + error);
    } catch {}
  }
};

const logout = async (req, res) => {
  try {
    const user = req.user;
    User.update({ Refresh: null }, { where: { ID: user.id } });
    return res.sendStatus(200);
  } catch (error) {
    try {
      res.status(500).send();
      console.log("Error " + error);
    } catch {}
  }
};

const confirm = async (req, res) => {
  try {
    const obj = req.body;
    if (!obj.hasOwnProperty("ID")) {
      res.status(400).send("Missing data");
      return;
    }
    if ((await User.count()) == 0) {
      res.status(404).json("No data");
      return;
    }
    let user = await User.findOne({ where: { ID: obj.ID } });
    if (!user) {
      res.status(404).json("This account is not created");
      return;
    }
    await User.update({ Confirm: true }, { where: { ID: obj.ID } });
    return res.status(200).json();
  } catch (error) {
    try {
      res.status(500).send();
      console.log("Error " + error);
    } catch {}
  }
};

const setRole = async (req, res) => {
  try {
    const obj = req.body;
    if ((!obj.hasOwnProperty("ID"), !obj.hasOwnProperty("Role"))) {
      res.status(400).send("Missing data");
      return;
    }
    if (obj.Role != "Employee" && obj.Role != "Manager") {
      res.status(406).json("Wrong role");
      return;
    }
    if ((await User.count()) == 0) {
      res.status(404).json("No data");
      return;
    }
    let user = await User.findOne({ where: { ID: obj.ID } });
    if (!user) {
      res.status(404).json("This account is not create");
      return;
    }
    await User.update({ Role: obj.Role }, { where: { ID: obj.ID } });
    return res.status(200).json();
  } catch (error) {
    try {
      res.status(500).send();
      console.log("Error " + error);
    } catch {}
  }
};

const getAllUser = async (req, res) => {
  try {
    const obj = req.body;
    if (!obj.hasOwnProperty("IsConfirm")) {
      return res.status(400).send("Missing data");
    }
    let Users = await User.findAll({
      attributes: ["Name", "LastName", "Email", "Role"],
      where: { Confirm: obj.IsConfirm },
    });

    return res.status(200).json(Users);
  } catch (error) {
    try {
      res.status(500).send();
      console.log("Error " + error);
    } catch {}
  }
};

function generateJWT(data) {
  const claims = {
    id: data.ID,
    username: data.Email,
    name: data.Name,
    lastname: data.LastName,
    role: data.Role,
  };
  return jwt.sign(claims, process.env.TOKEN_SECRET, { expiresIn: "1000s" }); //!!!DO TEST�W
}

function generateRefresh(data) {
  const claims = {
    id: data.ID,
    username: data.Email,
    name: data.Name,
    lastname: data.LastName,
    role: data.Role,
  };
  return jwt.sign(claims, process.env.TOKEN_REFRESH, { expiresIn: "90000s" }); //!!!DO TEST�W
}

const hashpassword = async (haslo) => {
  try {
    const hashedPassword = await bcrypt.hash(haslo, saltRounds);
    return hashedPassword;
  } catch (error) {
    return null;
  }
};

const comparepassword = async (user, data) => {
  try {
    const result = await bcrypt.compare(user, data);
    return result;
  } catch (error) {
    return false;
  }
};

module.exports = {
  login,
  register,
  confirm,
  getAllUser,
  setRole,
  refresh,
  logout,
};
