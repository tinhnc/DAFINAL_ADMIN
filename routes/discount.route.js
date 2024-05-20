const express = require("express")
const router = express.Router();


const DiscountController = require("../controllers/discount.controller");

router.get("/", DiscountController.getAllDiscounts);

// Add Discount
router.get("/add-discount", DiscountController.addDiscountGet)
router.post("/add-discount", DiscountController.createDiscount);
router.get("/edit-discount/:id", DiscountController.editGetDiscount);
// router.post("/edit-discount", DiscountController.updateDiscount)
router.put('/edit-discount/:id', DiscountController.updateDiscount);
router.delete("/delete/:id", DiscountController.deleteDiscount);


//
module.exports = router;