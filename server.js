const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const app = express();
app.enable("trust proxy");

app.use(cookieParser());
require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;
const DB = process.env.DATABASE;

const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsConfig));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
const movieRouter = require("./routes/movieRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log(err.name, err.message);
  process.exit(1);
});
//middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: "Too many requests. Try again in 60 minutes",
});
app.use("/api", limiter);
app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/users", userRouter);
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://teonazav.github.io/movies-frontend/#/"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
app.use(compression());

const connectDB = async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("DB connection successful!");
};
connectDB();
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
