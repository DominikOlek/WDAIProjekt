const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Cntrl = require("../Controllers/ShowController.js");
const Auth = require("../Authorize.js");


router.post('/add', Auth.authenticate, asyncHandler(Cntrl.addOne));

router.patch('/edit:id', Auth.authenticate, asyncHandler(Cntrl.edit));

router.delete('/delete:id', Auth.authenticate, asyncHandler(Cntrl.delOne)); 

router.get('/:id', asyncHandler(Cntrl.getOne));

router.post('/', asyncHandler(Cntrl.getAll));


module.exports = router;