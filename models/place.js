const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const placeSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// menghapus data parent place (misal data place( data pantai kuta) dihapus, reviews nya juga kehapus)
placeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Place", placeSchema);
