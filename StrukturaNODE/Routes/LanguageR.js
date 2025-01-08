const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Cntrl = require("../Controllers/LanguageController.js");
const Auth = require("../Authorize.js");

router.get('/', Auth.authenticate, asyncHandler(Cntrl.getAll));


module.exports = router;