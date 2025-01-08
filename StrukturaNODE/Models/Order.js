const { Sequelize } = require('sequelize');
const Order = {
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
    },
    Places: {
        type: Sequelize.DataTypes.JSONB, //[[2,1,0]] - rz¹d miejsce i typ(0 - normale , wszystko inne VIP)
        allowNull: false,
    },
    ShowID: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    IsVIP: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
    },
    Price: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
};
module.exports = Order;