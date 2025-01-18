const { Sequelize } = require('sequelize');
const MovieInfo = {
    ID: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    Director: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    Describe: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    CategoryID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    AgeCategory: {
        type: Sequelize.DataTypes.ENUM('All', 'Child', 'Teen', 'Adult'),
        allowNull: false,
    },
    Length: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    ImageSrc: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    Is3D: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
    },
    IsIMAX: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
    },
    Is4D: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
    },
    IsScreenX: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
    },
};
module.exports = MovieInfo;