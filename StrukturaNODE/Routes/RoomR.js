const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Cntrl = require("../Controllers/RoomController.js");
const Auth = require("../Authorize.js");

router.post("/add", Auth.authenticateManager, asyncHandler(Cntrl.addOne));

router.patch("/edit:id", Auth.authenticateManager, asyncHandler(Cntrl.edit));

router.delete(
  "/delete:id",
  Auth.authenticateManager,
  asyncHandler(Cntrl.delOne)
);

router.get("/:id", Auth.authenticate, asyncHandler(Cntrl.getOne));

router.get("/", asyncHandler(Cntrl.getAll));

module.exports = router;
