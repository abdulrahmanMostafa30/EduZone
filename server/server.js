

const path = require("path");

require("dotenv").config({ path: "../server/config.env" });
require("dotenv").config({ path: "./server/config.env" });
require("dotenv").config({ path: "config.env" });
require("dotenv").config({ path: "./config.env" });
require("dotenv").config({ path: "/etc/secrets/config.env" });
require("dotenv").config({ path: path.join(path.join(__dirname, '..', 'config.env')) });
require("dotenv").config({ path: path.join(path.join(__dirname, 'config.env')) });
require("dotenv").config({ path: path.join(path.join(__dirname, '..', '..', 'config.env')) });

require("dotenv").config({ path: "./server/config.env" });
require("dotenv").config({ path: "config.env" });
require("dotenv").config({ path: "./config.env" });
require("dotenv").config({ path: "/etc/secrets/config.env" });

const courseRoute = require('./routes/course')
const userRoute = require('./routes/user')
const cartRoute = require('./routes/cart')
const contactRoute = require('./routes/contact')
const purchaseRoute = require('./routes/purchase')

const globalErrorHandler = require('./controller/error');

const dbo = require("./db/conn");

const express = require("express");
const json = require("morgan-json");
const morgan = require("morgan");

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
app.use("/images", express.static(path.join("./uploads")));
// app.use("/images", express.static(path.join("images")));
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', '');
  next();
});
app.use("/api/users/auth", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/cart", cartRoute);
app.use("/api/contact", contactRoute);
app.use("/api/purchase", purchaseRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
app.listen(port, async () => {
  await dbo.connectToServer();
  console.log(`Server is running on port: ${port}`);
});
