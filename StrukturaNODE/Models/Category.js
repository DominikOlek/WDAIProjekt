const { Sequelize } = require('sequelize');
const Category = {
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
module.exports = Category;