const { format } = require("date-fns");

const CheckOut = require("../models/checkout.model");
const Rating = require("../models/rating.model");
const Handlebars = require("handlebars");
const Swal = require('sweetalert2');
module.exports = {
  showListRating: async (req, res) => {
    const perPage = 5; // Số lượng bài viết xuất hiện trên 1 trang
    const page = req.query.page || 1; // Số trang hiện tại

    try {
      const totalRatings = await Rating.countDocuments();
      // Sắp xếp bài viết theo ngày giờ giảm dần (mới nhất lên đầu)
      const ratings = await Rating.find()
        .sort({ date: -1 }) // Sắp xếp theo trường 'date' giảm dần
        .skip(perPage * (page - 1))
        .limit(perPage);
  
      const totalPages = Math.ceil(totalRatings / perPage);
  
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          page: i,
          isCurrentPage: i === +page,
        });
      }
  
      res.render("ratings/list-ratings", {
        ratings,
        pages,
        isNextPage: page < totalPages,
        isPreviousPage: page > 1,
        nextPage: +page + 1,
        previousPage: +page - 1,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi máy chủ nội bộ");
    }
  },
  editRating: async (req, res) => {
    try {
      const { nameUser, emailUser, rating, content } = req.body;
      await Rating.findByIdAndUpdate(req.params.id, { nameUser, emailUser, rating, content });
      res.redirect('/rating'); 
    } catch (err) {
      console.error(err);
    }
  },
  deleteRating: async (req, res) => {
    try {
      const rating = await Rating.findByIdAndDelete(req.params.id);

      if (!rating) {
        return res.status(404).send("Không tìm thấy đánh giá");
      }
      Swal.fire({
        title: "Cảm ơn bạn đã đánh giá!",
        text: "Outbreakstyle xin cảm ơn!",
        icon: "Thành công"
      });
      res.redirect("/rating");
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi máy chủ nội bộ");
    }
  },
};
