const express = require("express");
const router = express.Router();

const RatingController = require("../controllers/rating.controller");

router.get("/", RatingController.showListRating);

router.post("/update/:id", RatingController.editRating);

router.delete("/delete/:id", RatingController.deleteRating);


module.exports = router;
