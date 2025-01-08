const baza = require('../Controllers/DataBaseC.js');
const Room = baza.Room;
const Show = baza.Show;

const getAll = async (req, res) => {
    try {
        let rooms = await Room.findAll();

        res.status(200).json(rooms);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const getOne = async (req, res) => {
    try {
        let room = await Room.findOne({ where: { Number: req.params['id'] } });
        if (!room) {
            res.status(404).json("No room with this ID");
            return;
        }
        res.status(200).json(room);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const addOne = async (req, res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("Number") || !obj.hasOwnProperty("Places") || !obj.hasOwnProperty("ScreenSize") ) {
            res.status(400).send("Missing data");
            return;
        }
        let room = await Room.findOne({ where: { Number: obj.Number } });
        if (room) {
            res.status(404).json("This room exist earlier");
            return;
        }

        if (!isTwoDimensionalArray(obj.Places) || obj.ScreenSize < 0) {
            res.status(400).send("Wrong Places data");
            return;
        }
        if (!obj.hasOwnProperty("Is3D")) obj.Is3D = false; 
        if (!obj.hasOwnProperty("Is4D")) obj.Is4D = false; 
        if (!obj.hasOwnProperty("IsIMAX")) obj.IsIMAX = false; 
        if (!obj.hasOwnProperty("IsScreenX")) obj.IsScreenX = false; 
        room = await Room.create(obj);
        if (!room) {
            res.status(500).json("Database error");
        }
        res.status(201).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const isTwoDimensionalArray = (arr) => {
    return Array.isArray(arr) && arr.length > 0 && arr.every(inner => Array.isArray(inner) && inner.every(e => Number.isInteger(e)));
};

const delOne = async (req, res) => {
    try {
        let room = await Room.findOne({ where: { Number: req.params['id'] } });
        let show = await Show.findOne({ where: { RoomID: req.params['id'] } });
        if (show) {
            res.status(405).json("First cancel all show in this room");
        }
        if (!room) {
            res.status(404).json("No element");
        }
        await room.destroy();
        res.status(204).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const edit = async (req, res) => {
    try {
        const obj = req.body;
        let room = await Room.findOne({ where: { Number: req.params['id'] } });
        if (!room) {
            res.status(404).json("No element");
        }

        if (obj.hasOwnProperty("Number")) {
            res.status(405).send("Not allow to change Number");
            return;
        }
        if (obj.hasOwnProperty("Places") && !isTwoDimensionalArray(obj.Places)) {
            res.status(400).send("Wrong Places data");
        }

        await Room.update(obj, { where: { Number: req.params['id'] } });
        res.status(205).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }

};

module.exports = { getAll, getOne, addOne, delOne,edit };