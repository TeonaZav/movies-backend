const mongoose = require("mongoose");

const { Schema } = mongoose;

const movieSchema = new Schema({
  title: String,
  thumbnail: {
    trending: {
      small: String,
      large: String,
    },
    regular: {
      small: String,
      medium: String,
      large: String,
    },
  },
  year: String,
  category: String,
  rating: String,
  isBookmarked: {
    type: Boolean,
    default: false,
  },
  isTrending: Boolean,
});
const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
