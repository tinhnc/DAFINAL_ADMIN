const CheckOut = require("../models/checkout.model");
const User = require("../models/user.model");
const ShoppingCart = require("../models/shoppingcart.model");
const ProductOrder = require("../models/product_order.model");
const Product = require("../models/product.model");
const { subMilliseconds } = require("date-fns/fp");

module.exports = {
  showListOrder: async (req, res) => {
    try {
        const perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.query.page || 1; // số page hiện tại
        if (page < 1) {
            page = 1;
        }

        const listOrder = await CheckOut.find({})
            .skip(perPage * page - perPage)
            .limit(perPage);

        const count = await CheckOut.countDocuments();

        for (let i = 0; i < listOrder.length; i++) {
            const Customer = await User.findOne({ email: listOrder[i].email });

            if (Customer) {
                listOrder[i].name = Customer.name;
                listOrder[i].address = Customer.address;

                const shoppingCart = await ShoppingCart.findById(listOrder[i].idShoppingCart);

                if (shoppingCart) {
                    listOrder[i].time = shoppingCart.purchasedTime;
                    listOrder[i].listProductOrder = [];
                    let sum = 0;
                    let discount = 0;
                    let sumTotal = 0;



                    for (let j = 0; j < shoppingCart.listProductOrder.length; j++) {
                        const productOrder = await ProductOrder.findById(shoppingCart.listProductOrder[j]);

                        if (productOrder) {
                            sum += productOrder.unitPrice * productOrder.quantity;
                            listOrder[i].listProductOrder.push(productOrder);
                        }
                    }

                    console.log(shoppingCart)
                    console.log(shoppingCart.discount)

                    if(shoppingCart && shoppingCart.discount !== undefined){
                        discount = shoppingCart.discount
                        sumTotal = sum - discount;
                        console.log(discount)
                        console.log(sumTotal)
                    }else{
                        sumTotal = sum
                    }


                    listOrder[i].subtotal = sum;
                    listOrder[i].discount = discount;
                    listOrder[i].total = sumTotal;
                }
            } else {
                // Xử lý khi không tìm thấy thông tin người dùng
                listOrder[i].name = 'Không xác định';
                listOrder[i].address = 'Không xác định';
            }
        }

        const pages = [];
        for (let i = 1; i <= Math.ceil(count / perPage); i++) {
            const isCurrentPage = i === +page;

            pages.push({
                page: i,
                isCurrentPage,
            });
        }

        res.render("orders/list-orders", {
            listOrder,
            pages,
            isNextPage: page < Math.ceil(count / perPage),
            isPreviousPage: page > 1,
            nextPage: +page + 1,
            previousPage: +page - 1,
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        res.status(500).send('Đã xảy ra lỗi khi xử lý yêu cầu');
    }
},


  acceptOrder: async (req, res) => {
    const id = req.params.id;
    const order = await CheckOut.findById(id);
    order.status = "Delivering";
    await order.save();

    // const shoppingCart = await ShoppingCart.findById(order.idShoppingCart);

    // for (let i = 0; i < shoppingCart.listProductOrder.length; i++) {
    //     const productOrder = await ProductOrder.findById(
    //         shoppingCart.listProductOrder[i]
    //     );
    //     const product = await Product.find({
    //         idProduct: productOrder.idProduct,
    //     });
    //     //console.log(product[0].quantity);
    //     console.log(product[0]);
    //     console.log(productOrder);
    //     //console.log(productOrder.quantity);
    //     //product[0].quantity -= productOrder.quantity;
    //     //await product[0].save();
    // }

    res.redirect("/orders?page=1");
  },
  cancelOrder: async (req, res) => {
    const id = req.params.id;
    const order = await CheckOut.findById(id);
    order.status = "Canceled";
    await order.save();
    res.redirect("/orders?page=1");
  },
};
