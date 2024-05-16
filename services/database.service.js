require("dotenv").config();

module.exports = {
  connectDatabase: function () {
    const mongoose = require("mongoose");
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.73axp7p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connected to MongoDB");
      //   callback();
    });
  },
};
