const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Producer = require("../models/producer.model");
const CheckOut = require("../models/checkout.model");
const ShoppingCart = require("../models/shoppingcart.model");


module.exports = {
    index:  async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalProducers = await Producer.countDocuments();
        const totalCheckOuts = await CheckOut.countDocuments();
        const totalShoppingCarts = await ShoppingCart.countDocuments();



        res.render("dashboard", {
            totalUsers,
            totalBlogs,
            totalProducts,
            totalCategories,
            totalProducers,
            totalCheckOuts,
            totalShoppingCarts,
        });    
    } catch (err) {
            console.error(err);
            res.status(500).send("Lỗi máy chủ nội bộ");
          }
    },
};
