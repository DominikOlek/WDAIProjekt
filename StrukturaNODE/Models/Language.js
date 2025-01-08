const { Sequelize } = require('sequelize');
const Language = {
    ID: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
};
module.exports = Language;