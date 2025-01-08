const { Sequelize } = require('sequelize');
const Show = {
    ID: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    MovieID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    RoomID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    Places: {
        type: Sequelize.DataTypes.JSONB, // 2 wymiary jak sala kinowa wartoœci -1 - BRAK miejsca, 0-wolne miejsce i wszystko inne - zajête
        allowNull: false,
    },
    NormalPrice: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    VIPPrice: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    StartTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    EndTime: {
        type: Sequelize.DataTypes.DATE,
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
module.exports = Show;