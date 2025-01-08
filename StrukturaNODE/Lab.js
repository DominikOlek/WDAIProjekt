//              DEFINICJE

const express = require('express')
const dotenv = require('dotenv');
const app = express()
app.use(express.json());
dotenv.config();
const UserR = require('./Routes/UserR.js');
const RoomR = require('./Routes/RoomR.js');
const MovieR = require('./Routes/MovieR.js');
const LangR = require('./Routes/LanguageR.js');
const ShowR = require('./Routes/ShowR.js');
const OrderR = require('./Routes/OrderR.js');
const baza = require('./Controllers/DataBaseC.js');


const server = app.listen(5000, () => {
    console.log(`App start na porcie 5000`)
})

baza.connect();

//          EXIT

process.on('SIGINT', async () => {
    await baza.sequelize.close();
    server.close();
});

app.use("/api", UserR);
app.use("/room", RoomR);
app.use("/movie", MovieR);
app.use("/lang", LangR);
app.use("/show", ShowR);
app.use("/order", OrderR);