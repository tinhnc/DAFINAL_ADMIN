const Blog = require("../models/blog.model");
const multer = require("multer");
const path = require("path");

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Client/public/img/blog/")); // Define the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for the image
  },
});

const upload = multer({ storage: storage });

// Hàm định dạng ngày giờ
function formatDateTime(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDateTime = ` ${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
  return formattedDateTime;
}

// Define the renderForm function
function renderForm(req, res, blogData = {}) {
  res.render("blog/add-blog", { blog: blogData });
}

function renderForm2(req, res, blogData = {}) {
  res.render("blog/edit-blog", { blog: blogData });
}

module.exports = {
  showListBlog: async (req, res) => {
    const perPage = 5; // Số lượng bài viết xuất hiện trên 1 trang
    const page = req.query.page || 1; // Số trang hiện tại

    try {
      const totalBlogs = await Blog.countDocuments();
      // Sắp xếp bài viết theo ngày giờ giảm dần (mới nhất lên đầu)
      const blogs = await Blog.find()
        .sort({ date: -1 }) // Sắp xếp theo trường 'date' giảm dần
        .skip(perPage * (page - 1))
        .limit(perPage);
  
      const totalPages = Math.ceil(totalBlogs / perPage);
  
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          page: i,
          isCurrentPage: i === +page,
        });
      }

      // Định dạng ngày giờ cho từng bài viết trong danh sách
      blogs.forEach((blog) => {
        blog.date = formatDateTime(blog.date);
        blog.content = blog.content.slice(0, 200)+"...";
      });
  
      res.render("blog/list-blog", {
        blogs,
        pages,
        isNextPage: page < totalPages,
        isPreviousPage: page > 1,
        nextPage: +page + 1,
        previousPage: +page - 1,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  addBlogGet: (req, res) => {
    renderForm(req, res);
  },

  addBlogPost: upload.single("image"), 
  addBlogPostHandler: async (req, res) => {
    try {
      const { title, content, author, tags } = req.body;

      const newBlog = new Blog({
        title,
        content,
        author,
        tags: tags.split(","),
        image: req.file ? req.file.filename : "", 
      });

      await newBlog.save();

      res.redirect("/blog");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  editBlogGet: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }

      renderForm2(req, res, blog);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  editBlogPost: upload.single("image"), 
  editBlogPostHandler: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }

      // Update the blog post fields
      blog.title = req.body.title;
      blog.content = req.body.content;
      blog.author = req.body.author;
      blog.tags = req.body.tags.split(",");
      if (req.file) {
        blog.image = req.file.filename; // Update the image filename
      }

      await blog.save();

      res.redirect("/blog");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);

      if (!blog) {
        return res.status(404).send("Blog not found");
      }

      res.redirect("/blog");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
};
