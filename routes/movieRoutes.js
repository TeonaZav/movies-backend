const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
const authController = require("../controllers/authController");

router.use(bodyParser.json());
const movieController = require("../controllers/movieController");

router
  .route("/all")
  .get(movieController.getAll)
  .post(movieController.createMovie);

router
  .route("/all/:id")
  .get(movieController.getMovie)
  .patch(movieController.updateMovie);
router.route("/trending").get(movieController.getTrending);
router.route("/movies").get(movieController.getMovies);
router.route("/tvshows").get(movieController.getTvShows);
router
  .route("/bookmarked")
  .get(authController.protect, movieController.getBookmarked);
module.exports = router;
