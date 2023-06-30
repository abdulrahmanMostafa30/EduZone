
const courseRoute = require('./routes/course')
const userRoute = require('./routes/user')
const globalErrorHandler = require('./controller/error');

require("dotenv").config({ path: "../server/config.env" });

const dbo = require("./db/conn");

const express = require("express");
const json = require("morgan-json");
const morgan = require("morgan");

const path = require("path");
const app = express();
const cors = require("cors");
const AppError = require('./utils/appError');
const port = process.env.PORT || 5000;
app.use(cors());
const format = json(
  ":method :url :status :res[content-length] bytes :response-time ms"
);

app.use(morgan(format));
app.use(express.json());
app.use("/images", express.static(path.join("server/images")));
// app.use("/images", express.static(path.join("images")));

app.use("/api/users/auth", userRoute);
app.use("/api/course", courseRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
app.listen(port, async () => {
  await dbo.connectToServer();
  console.log(`Server is running on port: ${port}`);
});
