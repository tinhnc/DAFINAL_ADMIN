const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DiscountSchema = new Schema(
  {
    title: String,
    dayStart: String,
    dayEnd: String,
    codeDiscount: String,
    discount: Number,
    quantity: Number,
    description: String,
  },
  { collection: "discount" }
);

const Discount = mongoose.model("Discount", DiscountSchema);
module.exports = Discount;