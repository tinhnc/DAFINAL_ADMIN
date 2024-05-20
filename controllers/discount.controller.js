const Discount = require("../models/discount.model");

module.exports = {


 getAllDiscounts : async (req, res) => {
    const perPage = 5; // Số lượng bài viết xuất hiện trên 1 trang
    const page = req.query.page || 1; // Số trang hiện tại
  try {
    const totalDiscount = await Discount.countDocuments();
    const discounts = await Discount.find();
    const totalPages = Math.ceil(totalDiscount / perPage);
  
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          page: i,
          isCurrentPage: i === +page,
        });
      }
  
      res.render("discount/list-discount", {
        discounts,
        pages,
        isNextPage: page < totalPages,
        isPreviousPage: page > 1,
        nextPage: +page + 1,
        previousPage: +page - 1,
      });
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy mã giảm giá", error });
  }
},
// GET /discounts/:id
 getDiscountById : async (req, res) => {
  const { id } = req.params;
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy mã giảm giá", error });
  }
},
// Get add discount
addDiscountGet: async (req, res) => {
  try {
    const discounts = await Discount.find({});
    res.render("discount/add-discount", { discounts });
    console.log(req.body)
    
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy mã giảm giá", error });
  }

},
// POST /discounts
 createDiscount : async (req, res) => {
  const { title, dayStart, dayEnd, codeDiscount, discount, quantity,  description } = req.body;
    console.log(title, dayEnd, dayStart)
    console.log(req.body)
  try {
    const newDiscount = new Discount({
      title : title,
      dayStart : dayStart,
      dayEnd : dayEnd,
      codeDiscount : codeDiscount,
      quantity :quantity,
      discount : discount,
      description : description,
    });
    await newDiscount.save();
    const discounts = await Discount.find({});
    console.log("new", newDiscount)
    console.log(discounts)
    console.log(JSON.stringify(newDiscount))
    res.redirect("/discount");


    // res.status(201).json({ message: "Discount created successfully", newDiscount });
  } catch (error) {
    res.status(500).send("Lỗi máy chủ nội bộ");
  }
},
editGetDiscount: (req, res) => {
  Discount.findById(req.params.id, (err, discount) => {
    if (err) {
      console.log(err);
    } else {
      res.render("discount/edit-discount", {
        discount,
      });
    }
  });
},
// PUT /discounts/:id
updateDiscount : async (req, res) => {
  const { id } = req.params;
  const { title, dayStart, dayEnd, codeDiscount, quantity, discount, description } = req.body;
  
  try {
    const discountEntry = await Discount.findById(id);
    if (!discountEntry) {
      console.log("Discount not found for ID:", id); // Logging when discount is not found
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
    discountEntry.title = title;
    discountEntry.dayStart = dayStart;
    discountEntry.dayEnd = dayEnd;
    discountEntry.codeDiscount = codeDiscount;
    discountEntry.discount = discount;
    discountEntry.quantity = quantity;
    discountEntry.description = description;
    await discountEntry.save();
    res.status(200).json({ message: "Cập nhật giảm giá thành công", discount: discountEntry });
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật mã giảm giá", error });
  }
},

// DELETE /discounts/:id
 deleteDiscount : async (req, res) => {
  const { id } = req.params;
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }
    await discount.remove();
    res.status(200).json({ message: "Mã giảm giá đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa giảm giá", error });
  }
}
}

