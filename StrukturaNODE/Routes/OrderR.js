const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Cntrl = require("../Controllers/OrderController.js");
const Auth = require("../Authorize.js");


router.post('/add', asyncHandler(Cntrl.addOne));


router.get('/check/:id/:email',Auth.authenticate, asyncHandler(Cntrl.check));


module.exports = router;