const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProducerSchema = new Schema(
  {
    name: String,
    description: String,
    listIdProduct: [{ type: Schema.Types.ObjectId }],
  },
  { collection: "producer" }
);

const Producer = mongoose.model("Producer", ProducerSchema);
module.exports = Producer;
