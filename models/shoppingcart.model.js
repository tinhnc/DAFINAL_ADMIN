const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema(
  {
    listProductOrder: [{ type: Schema.Types.ObjectId }],
    status: { type: Schema.Types.Boolean },
    discount: { type: Schema.Types.String },
    purchasedTime: {
      type: Date,
      default: Date.now  // Sử dụng Date.now để tự động lấy thời gian hiện tại
    },
  },
  { collection: "shopping-cart" }
);

module.exports = mongoose.model("ShoppingCart", ShoppingCartSchema);
