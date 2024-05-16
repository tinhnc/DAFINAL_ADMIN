const express = require("express");
const router = express.Router();

const RevenueController = require("../controllers/revenue.controller");

// Tổng doanh thu
router.get("/", RevenueController.showRevenue);


// doanh thu theo thời gian
router.get("/prod", RevenueController.showRevenueProd);


module.exports = router;
