const CheckOut = require("../../models/checkout.model");
const ShoppingCart = require("../../models/shoppingcart.model");
const ProductOrder = require("../../models/product_order.model");

module.exports = {
  filterByMonth: async (req, res) => {
    const year = req.query.year;
    const filter = req.query.filter;

    try {
      console.log(year, filter);
      const listOrder = await CheckOut.find({ status: "Delivered" });

      if (year === "All") {
        const years = req.query.years;
        console.log(years);
        if (years) {
          const listYears = years.split(",");
          listYears.sort();
          const data = [];
          for (let i = 0; i < listYears.length; i++) {
            const total = await filterByYear(listYears[i], listOrder);
            data.push({
              year: listYears[i],
              total,
            });
          }
          res.status(200).json(data);
        } else {
          // Xử lý khi years không tồn tại
          res.status(400).json({ error: "No years provided" });
        }
      } else {
        const total = await filterByYear(year, listOrder);
        res.status(200).json({
          year,
          total: total,
        });
      }
    } catch (error) {
      console.error("Error in filterByMonth:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

// async function filterByYear(year, listOrder) {
//   let total = 0;
//   for (let i = 0; i < listOrder.length; i++) {
//     const shoppingCart = await ShoppingCart.findOne({
//       _id: listOrder[i].idShoppingCart,
//       purchasedTime: {
//         $gte: new Date(`${year}-01-01T00:00:00.000Z`),
//         $lte: new Date(`${year}-12-31T23:59:59.999Z`),
//       },
//     });
//     if (shoppingCart) {
//       let sum = 0;
//       for (let j = 0; j < shoppingCart.listProductOrder.length; j++) {
//         const productOrder = await ProductOrder.findById(
//           shoppingCart.listProductOrder[j]
//         );
//         sum += productOrder.unitPrice * productOrder.quantity;
//       }
//       total += sum;
//     }
//   }
//   return total;
// }
