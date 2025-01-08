const { Sequelize } = require('sequelize');
const Movie = {
    ID: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    MovieID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    LanguageID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    SubtitlesID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
};
module.exports = Movie;