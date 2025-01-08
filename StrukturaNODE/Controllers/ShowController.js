const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fn = Sequelize.fn;
const col = Sequelize.col;
const literal = Sequelize.literal;
const baza = require('../Controllers/DataBaseC.js');
const { Is3D } = require('../Models/MovieInfo.js');
const Language = baza.Language;
const MovieInfo = baza.MovieInfo;
const Movie = baza.Movie;
const Room = baza.Room;
const Show = baza.Show;
const Order = baza.Order;
const Category = baza.Category;

const AddInfo = async (list) => {
    for (const e of list) {
        await AddInfoOne(e);
    }
}

const AddInfoOne = async (e) => {
    let info = await Movie.findOne({ where: { ID: e.MovieID } });

    let lan = await Language.findOne({ where: { ID: info.dataValues.LanguageID } });
    e.dataValues.LanguageName = lan.dataValues.Name;
    lan = await Language.findOne({ where: { ID: info.dataValues.SubtitlesID } });
    e.dataValues.SubtitlesName = lan.dataValues.Name;

    info = await MovieInfo.findOne({ where: { ID: info.MovieID } });
    e.dataValues.Name = info.dataValues.Name;
    e.dataValues.Describe = info.dataValues.Describe;
    e.dataValues.Director = info.dataValues.Director;
    e.dataValues.AgeCategory = info.dataValues.AgeCategory;

    let cat = await Category.findOne({ where: { ID: info.dataValues.CategoryID } });
    e.dataValues.Category = cat.dataValues.Name;

    info = await Room.findOne({ where: { Number: e.RoomID } });
    e.dataValues.ScreenSize = info.dataValues.ScreenSize;
}

const getAll = async (req, res) => {
    try {
        const obj = req.body;
        let show;
        /*if (obj.hasOwnProperty("Title") && obj.hasOwnProperty("Date")) {
            show = await Show.findAll({
                where: {
                    Title: { [Op.like]: `% ${obj.Title}%` }, [Op.and]: [Sequelize.where(fn('date', col('StartTime')), '=', obj.StartTime.split('T')[0])]
                },
                order: [["StartTime", "ASC"]],
            });
        } else if (obj.hasOwnProperty("Title")) {
            show = await Show.findAll({
                where: {
                    Title: { [Op.like]: '%'+obj.Title+'%', },
                },
                order: [["StartTime", "ASC"]],
            });
        } else if (obj.hasOwnProperty("Date")) {
            show = await Show.findAll({
                where: {
                    [Op.and]: [Sequelize.where(fn('date', col('StartTime')), '=', obj.StartTime.split('T')[0])]
                },
                order: [["StartTime", "ASC"]],
            });
        } else {
            const currentDate = new Date();
            show = await Show.findAll({
                where: {
                    StartTime: {[Op.gt]: currentDate}
                },
                order: [["StartTime", "ASC"]],
            });
        }*/
        if (obj.hasOwnProperty("Date")) {
            show = await Show.findAll({
                where: {
                    [Op.and]: [Sequelize.where(fn('date', col('StartTime')), '=', obj.Date.split('T')[0])]
                },
                order: [["StartTime", "ASC"]],
            });
        } else {
            const currentDate = new Date();
            show = await Show.findAll({
                where: {
                    StartTime: { [Op.gt]: currentDate }
                },
                order: [["StartTime", "ASC"]],
            });
        }
        if (show) {
            await AddInfo(show);
        }

        res.status(200).json(show);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const getOne = async (req, res) => {
    try {
        let show = await Show.findOne({ where: { ID: req.params['id'] } });
        if (!show) {
            res.status(404).json("No show with this ID");
            return;
        }
        await AddInfoOne(show);
        res.status(200).json(show);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const addOne = async (req, res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("MovieID") || !obj.hasOwnProperty("RoomID") || !obj.hasOwnProperty("NormalPrice") || !obj.hasOwnProperty("VIPPrice") || !obj.hasOwnProperty("StartTime") || !obj.hasOwnProperty("EndTime")) {
            res.status(400).send("Missing data");
            return;
        }

        let movie = await Movie.findOne({ where: { ID: obj.MovieID } });
        if (!movie) {
            res.status(404).json("No movie with this ID");
            return;
        }
        movie = await MovieInfo.findOne({ where: { ID: movie.MovieID } });
        if (!movie) {
            res.status(404).json("Error with movie");
            return;
        }
        let room = await Room.findOne({ where: { Number: obj.RoomID } });
        if (!room) {
            res.status(404).json("No room with this ID");
            return;
        }
        const start = new Date(obj.StartTime);
        const end = new Date(obj.EndTime);

        let allInRoom = await Show.findAll({
            where: {
                RoomID: obj.RoomID, [Op.and]: [
                    Sequelize.where(fn('date', col('StartTime')), '=', obj.StartTime.split('T')[0])
                ]
            }
        });
        
        for (const e of allInRoom) {
            if (new Date(e.StartTime) < start && new Date(e.EndTime) > start || new Date(e.StartTime) < end && new Date(e.EndTime) > end) {
                res.status(406).json("Other show is in this room at this time");
                return;
            }
        }

        if (!obj.hasOwnProperty("Is3D")) obj.Is3D = false;
        if (!obj.hasOwnProperty("Is4D")) obj.Is4D = false;
        if (!obj.hasOwnProperty("IsIMAX")) obj.IsIMAX = false;
        if (!obj.hasOwnProperty("IsScreenX")) obj.IsScreenX = false;

        if (obj.Is3D && (!movie.Is3D || !room.Is3D)) {
            res.status(406).json("This movie or room is not 3D");
            return;
        }
        if (obj.Is4D && (!movie.Is4D || !room.Is4D)) {
            res.status(406).json("This movie or room is not 4D");
            return;
        }
        if (obj.IsIMAX && (!movie.IsIMAX || !room.IsIMAX)) {
            res.status(406).json("This movie or room is not IMAX");
            return;
        }
        if (obj.IsScreenX && (!movie.IsScreenX || !room.IsScreenX)) {
            res.status(406).json("This movie or room is not ScreenX");
            return;
        }

        
        start.setMinutes(start.getMinutes() + movie.Length);
        if (start>end) {
            res.status(406).json("Wrong Times");
            return;
        }
        obj.Places = JSON.parse(JSON.stringify(room.Places));

        await Show.create(obj);
        res.status(201).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const delOne = async (req, res) => {
    try {
        let show = await Show.findOne({ where: { ID: req.params['id'] } });
        if (!show) {
            res.status(404).json("No show with this ID");
            return;
        }

        let order = await Order.findOne({ where: { ShowID: req.params['id'] } });
        if (order) {
            res.status(405).json("Someone is order this show, can't delete");
            return;
        }
        await show.destroy();
        res.status(204).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const edit = async (req, res) => {
    try {
        const obj = req.body;
        let show = await Show.findOne({ where: { ID: req.params['id'] } });
        if (!show) {
            res.status(404).json("No element");
        }

        let movie = await Movie.findOne({ where: { ID: show.MovieID } });
        if (obj.hasOwnProperty("MovieID")) {
            movie = await Movie.findOne({ where: { ID: obj.MovieID } });
            if (!movie) {
                res.status(404).json("No movie with this ID");
                return;
            }
            if (show.StartTime + (movie.Length * 60) > show.EndTime) {
                res.status(406).json("Wrong Times");
                return;
            }
        }
        let start = new Date(show.StartTime);
        let end = new Date(show.EndTime);
        if (obj.hasOwnProperty("RoomID")) {
            let room = await Room.findOne({ where: { Number: obj.RoomID } });
            if (!room) {
                res.status(404).json("No room with this ID");
                return;
            }
            let allInRoom = await Show.findAll({
                where: {
                    RoomID: obj.RoomID,
                    [Op.and]: [
                        Sequelize.where(fn('date', col('StartTime')), '=', show.StartTime.toString().split('T')[0])
                    ]
                }
            });
            for (const e of allInRoom) {
                if (new Date(e.StartTime) < start && new Date(e.EndTime) > start || new Date(e.StartTime) < end && new Date(e.EndTime) > end) {
                    res.status(406).json("Other show is in this room at this time");
                    return;
                }
            }
        }
        movie = await MovieInfo.findOne({ where: { ID: movie.MovieID } });
        if (obj.hasOwnProperty("Is3D")&& obj.Is3D && (!movie.Is3D || !room.Is3D)) {
            res.status(406).json("This movie or room is not 3D");
            return;
        }
        if (obj.hasOwnProperty("Is4D") && obj.Is4D && (!movie.Is4D || !room.Is4D)) {
            res.status(406).json("This movie or room is not 4D");
            return;
        }
        if (obj.hasOwnProperty("IsIMAX") && obj.IsIMAX && (!movie.IsIMAX || !room.IsIMAX)) {
            res.status(406).json("This movie or room is not IMAX");
            return;
        }
        if (obj.hasOwnProperty("IsScreenX") && obj.IsScreenX && (!movie.IsScreenX || !room.IsScreenX)) {
            res.status(406).json("This movie or room is not ScreenX");
            return;
        }

        let StartA;
        let EndA;

        if (obj.hasOwnProperty("StartTime") && obj.hasOwnProperty("EndTime")) {
            start = new Date(obj.StartTime);
            end = new Date(obj.EndTime);
            start.setMinutes(start.getMinutes() + movie.Length);
            if (start > end) {
                res.status(406).json("Wrong Times");
                return;
            }
            StartA = obj.StartTime;
            EndA = obj.EndTime;
        } else if (obj.hasOwnProperty("StartTime")) {
            start = new Date(obj.StartTime);
            end = new Date(show.EndTime);
            start.setMinutes(start.getMinutes() + movie.Length);
            if (start > end) {
                res.status(406).json("Wrong Times");
                return;
            }
            StartA = obj.StartTime;
            EndA = show.EndTime;
        } else {
            start = new Date(show.StartTime);
            end = new Date(obj.EndTime);
            start.setMinutes(start.getMinutes() + movie.Length);
            if (start > end) {
                res.status(406).json("Wrong Times");
                return;
            }
            StartA = show.StartTime;
            EndA = obj.EndTime;
        }

        if (obj.hasOwnProperty("StartTime") || obj.hasOwnProperty("EndTime")) {
            let allInRoom = await Show.findAll({
                where: {
                    RoomID: obj.RoomID,
                    [Op.and]: [
                        Sequelize.where(fn('date', col('StartTime')), '=', StartA.toString().split('T')[0])
                    ]
                }
            });

            StartA = new Date(StartA);
            EndA = new Date(EndA);
            for (const e of allInRoom) {
                if (new Date(e.StartTime) < StartA && new Date(e.EndTime) > StartA || new Date(e.StartTime) < EndA && new Date(e.EndTime) > EndA) {
                    res.status(406).json("Other show is in this room at this time");
                    return;
                }
            }
        }
        
        await Show.update(obj, { where: { ID: req.params['id'] } });
        res.status(205).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }

};

module.exports = { getAll, getOne, addOne, delOne, edit };