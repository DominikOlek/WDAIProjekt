const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Cntrl = require("../Controllers/MovieController.js");
const Auth = require("../Authorize.js");


router.post('/add', Auth.authenticate, asyncHandler(Cntrl.addOne));

router.post('/add/:id/:idL/:idS', Auth.authenticate, asyncHandler(Cntrl.addOneVersion)); // dodawanie tylko wersji jezykowych

router.patch('/edit:id', Auth.authenticate, asyncHandler(Cntrl.editInfo)); //edycja tylko info

router.delete('/delete:id', Auth.authenticate, asyncHandler(Cntrl.delOne)); // usuwanie tylko wersji jezykowych

router.get('/category', Auth.authenticate, asyncHandler(Cntrl.getAllCategory));

router.post('/category', Auth.authenticate, asyncHandler(Cntrl.AddCategory));

router.get('/:id', Auth.authenticate, asyncHandler(Cntrl.getOne));

router.get('/', Auth.authenticate, asyncHandler(Cntrl.getAll));



module.exports = router;