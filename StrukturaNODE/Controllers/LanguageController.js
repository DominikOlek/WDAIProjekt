const baza = require('../Controllers/DataBaseC.js');
const Language = baza.Language;

const getAll = async (req, res) => {
    try {
        let lang = await Language.findAll();
        return res.status(200).json(lang);
    } catch (error) {
        try { res.status(500).send(); console.log("Error " + error); } catch { }
    }
};

module.exports = { getAll };