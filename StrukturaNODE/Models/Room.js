const { Sequelize } = require('sequelize');
const Room = {
    Number: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
    },
    Places: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: false,
    },
    ScreenSize: {
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
module.exports = Room;