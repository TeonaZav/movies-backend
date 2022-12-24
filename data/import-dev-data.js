const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const Movie = require("../models/movieModel");

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log("successful"));
const movies = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));
const importData = async () => {
  try {
    await Movie.create(movies);
    console.log("data loaded");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Movie.deleteMany();
    console.log("data loaded");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
console.log(process.argv);
