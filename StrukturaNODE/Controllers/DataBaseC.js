const UserR = require('../Routes/UserR.js');
const UserModel = require('../Models/User.js');
const MovieModel = require('../Models/Movie.js');
const MovieInfoModel = require('../Models/MovieInfo.js');
const RoomModel = require('../Models/Room.js');
const LangModel = require('../Models/Language.js');
const ShowModel = require('../Models/Show.js');
const CategoryModel = require('../Models/Category.js');
const OrderModel = require('../Models/Order.js');


const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database2.sqlite',
    pool: {
        max: 5,
        min: 0,
        acquire: 1000,
        idle: 1000,
    },
});


const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Baza polaczona');
    } catch (error) {
        console.error('Brak polaczenia z baza: ', error);
    }
};

var User = sequelize.define('User', UserModel);
var Room = sequelize.define('Room', RoomModel);
var Movie = sequelize.define('Movie', MovieModel);
var MovieInfo = sequelize.define('MovieInfo', MovieInfoModel);
var Language = sequelize.define('Language', LangModel);
var Show = sequelize.define('Show', ShowModel);
var Category = sequelize.define('Category', CategoryModel);
var Order = sequelize.define('Order', OrderModel);

Language.hasMany(Movie, { foreignKey: 'LanguageID' });
Language.hasMany(Movie, { foreignKey: 'SubtitlesID' });
MovieInfo.hasMany(Movie, { foreignKey: 'MovieID' });

Movie.hasMany(Show, { foreignKey: 'MovieID' });
Room.hasMany(Show, { foreignKey: 'RoomID' });

Category.hasMany(MovieInfo, { foreignKey: 'CategoryID' });

Show.hasMany(Order, { foreignKey: 'ShowID' });
//Movie.belongsTo(Movie, { foreignKey: 'ID_UZYTKOWNIKA' });


(async () => {
    try {
        await sequelize.sync();
        console.log('Baza synchronizowana');
    } catch (error) {
        console.error('Error Baza nie synchronizowana: ', error);
    }
})();


module.exports = { sequelize, connect,User,Room,Movie,MovieInfo,Language,Show,Category,Order }