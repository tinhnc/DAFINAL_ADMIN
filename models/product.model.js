const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    name: String,
    details: String,
    quantity: Number,
    price: Number,
    priceSale: { type: Number },
    image: String,
    listImgExtra: [],
    category: String,
    producer: String,
    idProduct: String,
    listIdRating: [{ type: Schema.Types.ObjectId }],
    url: String,
    att: {
      type: [
        {
          size: {
            type: String,
            // required: true,
          },
          color: {
            type: String,
            // required: true,
          },
        },
      ],
    },

    // sizes: [
    //   {
    //     name: {
    //       type: String,
    //       required: true,
    //     },
    //     quantity: {
    //       type: Number,
    //       default: 0,
    //     },
    //   },
    // ],
    // colors: [
    //   {
    //     name: {
    //       type: String,
    //       required: true,
    //     },
    //     hexCode: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
  },
  { collection: "product" }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
