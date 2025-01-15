const baza = require('../Controllers/DataBaseC.js');
const Language = baza.Language;
const MovieInfo = baza.MovieInfo;
const Movie = baza.Movie;
const Show = baza.Show;
const Category = baza.Category;

const AddInfo = async (list) => {
    for (const e of list) {
        await AddInfoOne(e);
    }
}

const AddInfoOne = async (e) => {
    let info = await MovieInfo.findOne({ where: { ID: e.MovieID } });
    if (!info) {
        return;
    }
    e.dataValues.Name = info.Name;
    e.dataValues.Describe = info.Describe;
    e.dataValues.is3D = info.Is3D;
    e.dataValues.is4D = info.Is4D;
    e.dataValues.IsIMAX = info.IsIMAX;
    e.dataValues.IsScreenX = info.IsScreenX;
    e.dataValues.Director = info.Director;
    e.dataValues.AgeCategory = info.AgeCategory;
    e.dataValues.Length = info.Length;
    let lan = await Language.findOne({ where: { ID: e.LanguageID } });
    e.dataValues.LanguageName = lan.Name;
    lan = await Language.findOne({ where: { ID: e.SubtitlesID } });
    e.dataValues.SubtitlesName = lan.Name;
    let cat = await Category.findOne({ where: { ID: info.CategoryID } });
    e.dataValues.Category = cat.Name;
}


const getAll = async (req, res) => {
    try {
        let movies = await Movie.findAll();

        if (movies) {
            await AddInfo(movies);
        }

        return res.status(200).json(movies);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const getAllCategory = async (req, res) => {
    try {
        let categories = await Category.findAll();

        return res.status(200).json(categories);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const AddCategory = async (req, res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("Name")) {
            res.status(400).send("Missing data");
            return;
        }

        await Category.create({ 'Name': obj.Name });
        return res.status(201).json("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const getOne = async (req, res) => {
    try {
        let movie = await Movie.findOne({ where: { ID: req.params['id'] } });
        if (!movie) {
            return res.status(404).json("No movie with this ID");
        }
        await AddInfoOne(movie);
        return res.status(200).json(movie);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const addOne = async (req, res) => {
    try {
        const obj = req.body;
        if (!obj.hasOwnProperty("Name") || !obj.hasOwnProperty("Describe") || !obj.hasOwnProperty("Languages") || !obj.hasOwnProperty("Subtitles") || !obj.hasOwnProperty("Director") || !obj.hasOwnProperty("CategoryID") || !obj.hasOwnProperty("AgeCategory") || !obj.hasOwnProperty("Length")) {
            return res.status(400).send("Missing data");
        }
        if (obj.Length <= 0) {
            return res.status(400).send("Wrong length");
        }
        if (!isArray(obj.Languages) || !isArray(obj.Subtitles) || obj.Languages.length != obj.Subtitles.length) {
            return res.status(400).send("Wrong Language/Subtitles data");
        }
        if (obj.AgeCategory != "All" && obj.AgeCategory != "Child" && obj.AgeCategory != "Teen" && obj.AgeCategory != "Adult") {
            return res.status(400).send("Wrong AgeCategory data");
        }
        let category = await Category.findOne({ where: { ID: obj.CategoryID } });
        if (!category) {
            return res.status(404).json("No Category with this ID");
        }
        if (!obj.hasOwnProperty("Is3D")) obj.Is3D = false;
        if (!obj.hasOwnProperty("Is4D")) obj.Is4D = false;
        if (!obj.hasOwnProperty("IsIMAX")) obj.IsIMAX = false;
        if (!obj.hasOwnProperty("IsScreenX")) obj.IsScreenX = false;

        let movieInfo = await MovieInfo.create(obj);
        if (!movieInfo) {
            return res.status(500).json("Database error");
        }

        for (let i = 0; i < obj.Languages.length; i++) {
            let lan = await Language.findOne({ where: { ID: obj.Languages[i] } });
            let sub = await Language.findOne({ where: { ID: obj.Subtitles[i] } });
            if (!lan || !sub) {
                continue;
            }
            await Movie.create({ 'MovieID': movieInfo.ID, 'LanguageID': obj.Languages[i], 'SubtitlesID': obj.Subtitles[i] });
        }

        return res.status(201).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const addOneVersion = async (req, res) => {
    try {

        let movie = await Movie.findOne({ where: { ID: req.params['id'] } });
        let lan = await Language.findOne({ where: { ID: req.params['idL'] } });
        let sub = await Language.findOne({ where: { ID: req.params['idS'] } });
        if (!movie || !lan || !sub) {
            return res.status(404).json("No element");
        }

        await Movie.create({ 'MovieID': req.params['id'], 'LanguageID': req.params['idL'], 'SubtitlesID': req.params['idS'] });
        return res.status(205).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
}; 

const isArray = (arr) => {
    return Array.isArray(arr) && arr.length > 0;
};

const delOne = async (req, res) => {
    try {
        let movie = await Movie.findOne({ where: { ID: req.params['id'] } });
        let show = await Show.findOne({ where: { MovieID: req.params['id'] } });
        if (show) {
            return res.status(405).json("First cancel all show with this movie");
        }
        if (!movie) {
            return res.status(404).json("No element");
        }
        await movie.destroy();
        return res.status(204).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

const editInfo = async (req, res) => {
    try {
        const obj = req.body;
        let movieInfo = await MovieInfo.findOne({ where: { ID: req.params['id'] } });
        if (!movieInfo) {
            return res.status(404).json("No element");
        }

        if (obj.hasOwnProperty("AgeCategory") && obj.AgeCategory != "All" && obj.AgeCategory != "Child" && obj.AgeCategory != "Teen" && obj.AgeCategory != "Adult") {
            return res.status(400).send("Wrong AgeCategory data");
        }
        if (obj.hasOwnProperty("CategoryID")) {
            let category = await Category.findOne({ where: { ID: obj.CategoryID } });
            if (!category) {
                return res.status(404).json("No Category with this ID");
            }
        }

        await MovieInfo.update(obj, { where: { ID: req.params['id'] } });
        return res.status(205).send("OK");
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }

};

module.exports = { getAll, getOne, addOne, addOneVersion, delOne, editInfo, getAllCategory, AddCategory };