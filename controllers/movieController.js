const Movie = require("../models/movieModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = catchAsync(async (req, res, next) => {
  const query = Movie.find().sort({ _id: -1 });
  const movies = await query;
  res.status(200).json({
    status: "success",
    result: movies.length,
    data: movies,
  });
});

exports.getTrending = catchAsync(async (req, res, next) => {
  const query = Movie.find({ isTrending: true }).sort({ _id: 1 });
  const trending = await query;
  res.status(200).json({
    status: "success",
    data: trending,
  });
});
exports.getMovies = catchAsync(async (req, res, next) => {
  const query = Movie.find({ category: "Movie" }).sort({ _id: -1 });
  const movies = await query;
  res.status(200).json({
    status: "success",
    data: movies,
  });
});
exports.getTvShows = catchAsync(async (req, res, next) => {
  const query = Movie.find({ category: "TV Series" }).sort({ _id: -1 });
  const shows = await query;
  res.status(200).json({
    status: "success",
    data: shows,
  });
});
exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return next(new AppError("There is no movie with mentioned id", 404));
  }
  res.status(200).json({
    status: "success",
    data: { movie },
  });
});

exports.getBookmarked = catchAsync(async (req, res, next) => {
  const query = Movie.find({ isBookmarked: true }).sort({ _id: -1 });
  const bookmarked = await query;
  res.status(200).json({
    status: "success",
    data: bookmarked,
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);
  res.status(201).json({
    status: "success",
    data: newMovie,
  });
});
exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    isBookmarked: !req.body.isBookmarked,
  });
  if (!movie) {
    return next(new AppError("There is no movie with mentioned id", 404));
  }
  res.status(201).json({
    status: "success",
    data: movie,
  });
});
