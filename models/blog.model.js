const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: String,
    content: String,
    author: String,
    date: {
      type: String, // Định dạng ngày giờ trực tiếp thành chuỗi
      default: new Date().toString(), // Mặc định là ngày giờ hiện tại dưới dạng chuỗi
    },
    image: String, // Add an image field to store the image filename
    comments: [
      {
        user: String,
        text: String,
        date: {
          type: String, // Định dạng ngày giờ trực tiếp thành chuỗi
          default: new Date().toString(), // Mặc định là ngày giờ hiện tại dưới dạng chuỗi
        },
      }
    ],
    tags: [String],
  },
  { collection: "blogs" }
);

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
