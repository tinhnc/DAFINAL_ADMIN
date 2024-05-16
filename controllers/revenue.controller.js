const { format } = require("date-fns");

const CheckOut = require("../models/checkout.model");
const ShoppingCart = require("../models/shoppingcart.model");
const ProductOrder = require("../models/product_order.model");
const Handlebars = require("handlebars");

module.exports = {
  showRevenue: async (req, res) => {
    try {
      // Lấy danh sách các đơn hàng đã giao hàng (Delivered)
      const listOrder = await CheckOut.find({ status: "Delivering" });

      // Khai báo một mảng để lưu trữ dữ liệu thống kê
      const revenueData = [];

      for (const order of listOrder) {
        const shoppingCart = await ShoppingCart.findById(order.idShoppingCart);
        
        if(shoppingCart.purchasedTime){
          const formattedDate = format(shoppingCart.purchasedTime, 'dd/MM/yyyy');
        }
        let totalRevenue = 0;

        for (const productOrder of shoppingCart.listProductOrder) {
          const product = await ProductOrder.findById(productOrder);
          if (product) {
            totalRevenue += product.unitPrice * product.quantity;
          }
        }

        // Thêm cặp giá trị ngày/tháng và tổng doanh thu vào mảng revenueData
        revenueData.push({ date: formattedDate, total: totalRevenue });
      }

      // console.log("re::"  + revenueData);

      // Render trang thống kê với dữ liệu
      res.render("revenue/time", {
        data: JSON.stringify(revenueData), // Đặt JSON.stringify ở đây nếu bạn cần dữ liệu dưới dạng chuỗi JSON
      });
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error in showRevenue:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  showRevenueProd: async (req, res) => {
    try {
      const listOrder = await CheckOut.find({ status: "Delivering" });
  
      const revenueData = [];
  
      for (const order of listOrder) {
        const shoppingCart = await ShoppingCart.findById(order.idShoppingCart);
        const formattedDate = format(shoppingCart.purchasedTime, 'dd/MM/yyyy');
        
        const products = await ProductOrder.find({ _id: { $in: shoppingCart.listProductOrder } });
  
        for (const product of products) {
          const totalRevenue = product.unitPrice * product.quantity;
          revenueData.push({ date: formattedDate, product: product.name, total: totalRevenue });
        }
      }
  
      res.render("revenue/prod", {
        data: JSON.stringify(revenueData),
      });
    } catch (error) {
      console.error("Error in showRevenueProd:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
