const { Sequelize } = require('sequelize');
const User = {
    ID: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    LastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Password: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    Confirm: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
    },
    Role: {
        type: Sequelize.DataTypes.ENUM('Employee','Manager'),
        allowNull: false,
    },
    Refresh: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
    }
};
module.exports = User;