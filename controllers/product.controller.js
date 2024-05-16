const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Producer = require("../models/producer.model");
const to_slug = require("../public/js/slug.js");

function formatPrice(price) {
  if (typeof price !== 'number') {
    return 'Invalid Price';
  }

  const formattedPrice = price.toFixed(2);

  const parts = formattedPrice.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.') + '₫';
}


module.exports = {
  
  showListProduct: (req, res) => {
    let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.query.page || 1; // số page hiện tại
    if (page < 1) {
      page = 1;
    }

    Product.find() // find tất cả các data
      .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .exec((err, product) => {
        Product.countDocuments((err, count) => {
          // đếm để tính có bao nhiêu trang
          if (err) return next(err);
          let isCurrentPage;
          const pages = [];
          for (let i = 1; i <= Math.ceil(count / perPage); i++) {
            if (i === +page) {
              isCurrentPage = true;
            } else {
              isCurrentPage = false;
            }
            pages.push({
              page: i,
              isCurrentPage: isCurrentPage,
            });
          }


          product.forEach((item) => {
            item.totalQuantity = item.att
              .flatMap((item) => item)
              .reduce((total, item) => total + item.quantity, 0);
    
            // Định dạng giá tiền
            item.priceFormatted = formatPrice(item.price);
            item.details = item.details.replace(/(<([^>]+)>)/gi, "").slice(0, 200) + "...";

    
            // Định dạng giá giảm giá (nếu có)
            if (item.priceSale) {
              item.priceSaleFormatted = formatPrice(item.priceSale);
            }
          });

          res.render("product/list-product", {
            product,
            pages,
            isNextPage: page < Math.ceil(count / perPage),
            isPreviousPage: page > 1,
            nextPage: +page + 1,
            previousPage: +page - 1,
          });
        });
      });
  },
  addProductGet: async (req, res) => {
    const category = await Category.find({});
    const producer = await Producer.find({});
    res.render("product/add-product", {
      category,
      producer,
    });
  },
  //add product post and add product id to category and producer
  addProductPost: async (req, res) => {
    try {
      const category = await Category.findById(req.body.id_category);
      const idProduct = to_slug(req.body.name) + "-" + Date.now();
      const url = category.idCategory + "/" + idProduct;
      const attData = req.body.att.map(jsonString => JSON.parse(jsonString));
  
      const listImgExtra =
        req.body.listUrlImageExtra && typeof req.body.listUrlImageExtra === "string"
          ? req.body.listUrlImageExtra.split(",")
          : [];


        var  attList = []
      // Kiểm tra xem dữ liệu đã được gửi chưa
      if (attData && attData.length > 0) {
        // Loop qua từng phần tử trong attData
        for (const attItem of attData) {
          // Thực hiện xử lý với từng phần tử
          const { size, color } = attItem;
          attList.push(attItem)
          // Thực hiện các thao tác khác với dữ liệu đã lấy được
          console.log(`Size: ${size}, Color: ${color}`);
        }
        // Tiếp tục xử lý logic khác ở đây nếu cần
        console.log('Dữ liệu đã được nhận và xử lý thành công.');
      } else {
        console.log('Dữ liệu không hợp lệ hoặc không tồn tại.');
      }

      
  
      const product = new Product({
        name: req.body.name,
        details: req.body.details,
        quantity: req.body.quantity,
        price: req.body.price,
        priceSale: req.body.priceSale,
        image: req.body.urlImage,
        listImgExtra: listImgExtra,
        category: req.body.category,
        producer: req.body.producer,
        idProduct: idProduct,
        listIdRating: [],
        url: url,
        att: attList,
      });
  
      await product.save();
  
      // find category and push product id
      await Category.findByIdAndUpdate(req.body.id_category, {
        $push: { listIdProduct: product._id },
      });
  
      // find producer and push product id
      await Producer.findByIdAndUpdate(req.body.id_producer, {
        $push: { listIdProduct: product._id },
      });
  
      res.redirect("/product?page=1");
    } catch (err) {
      console.error(err);
      res.render("product/add-product", { msg: err.message });
    }
  },
  

  // edit product and find current id category of this product
 // edit product and find current id category of this product
editProductGet: async (req, res) => {
  try {
    // Tìm tất cả danh mục và nhà sản xuất sử dụng async/await
    const categories = await Category.find({});
    const producers = await Producer.find({});

    // Tìm sản phẩm theo ID
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Sản phẩm không tồn tại");
    }

    // Tìm danh mục hiện tại cho sản phẩm
    const currentCategory = await Category.findOne({
      listIdProduct: product._id,
    });

    // Lấy danh sách att từ sản phẩm
    const attListData = product.att || [];

    res.render("product/edit-product", {
      product,
      producer: producers,
      category: categories,
      idCurrentCategory: currentCategory ? currentCategory._id : null,
      attListData, // Truyền danh sách att
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi máy chủ nội bộ");
  }
},


  // edit product post and remove product id to old category and push product id to new category
  // and remove product id from listIdProduct of old producer and push product id to new producer
  // and using async await
  editProductPost: async (req, res) => {
    try {
      const category = await Category.findById(req.body.id_category);
      const url = category.idCategory + "/" + req.body.idProduct;
  
      const attData = req.body.att.map(jsonString => JSON.parse(jsonString));
      console.log(attData);
  
      const listImgExtra =
        req.body.listUrlImageExtra && typeof req.body.listUrlImageExtra === "string"
          ? req.body.listUrlImageExtra.split(",")
          : [];
  

        var  attList = []
      // Kiểm tra xem dữ liệu đã được gửi chưa
      if (attData && attData.length > 0) {
        // Loop qua từng phần tử trong attData
        for (const attItem of attData) {
          // Thực hiện xử lý với từng phần tử
          const { size, color } = attItem;
          attList.push(attItem)
          // Thực hiện các thao tác khác với dữ liệu đã lấy được
          console.log(`Size: ${size}, Color: ${color}`);
        }
        // Tiếp tục xử lý logic khác ở đây nếu cần
        console.log('Dữ liệu đã được nhận và xử lý thành công.');
      } else {
        console.log('Dữ liệu không hợp lệ hoặc không tồn tại.');
      }

  
        const product = await Product.findByIdAndUpdate(req.body.id, {
          $set: {
            name: req.body.name,
            details: req.body.details,
            quantity: req.body.quantity,
            price: req.body.price,
            priceSale: req.body.priceSale,
            image: req.body.urlImage,
            listImgExtra: listImgExtra,
            category: req.body.category,
            producer: req.body.producer,
            idProduct: req.body.idProduct,
            listIdRating: [],
            att: attList,
          },
        });
  
        // Cập nhật category
        const currentCategory = await Category.findOneAndUpdate(
          { listIdProduct: product._id },
          { $pull: { listIdProduct: product._id } }
        );
        await Category.findByIdAndUpdate(currentCategory._id, {
          $addToSet: { listIdProduct: product._id },
        });
  
        // Cập nhật producer
        await Producer.findByIdAndUpdate(req.body.id_producer, {
          $pull: { listIdProduct: product._id },
        });
        await Producer.findByIdAndUpdate(req.body.id_producer, {
          $addToSet: { listIdProduct: product._id },
        });
  
  
      res.redirect("/product?page=1");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
  

  // delete product and remove product id to category and producer
  deleteProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      const currentCategory = await Category.findOneAndUpdate(
        { listIdProduct: req.params.id },
        { $pull: { listIdProduct: req.params.id } }
      );

      const currentProducer = await Producer.findOneAndUpdate(
        { listIdProduct: req.params.id },
        { $pull: { listIdProduct: req.params.id } }
      );

      res.redirect("/product?page=1");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
};
