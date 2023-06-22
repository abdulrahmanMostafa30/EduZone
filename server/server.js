
const courseRoute = require('./routes/course')
require("dotenv").config({ path: "../server/config.env" });
const dbo = require("./db/conn");

const express = require("express");
const json = require("morgan-json");
const morgan = require("morgan");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
const format = json(
  ":method :url :status :res[content-length] bytes :response-time ms"
);

app.use(morgan(format));
app.use(express.json());

app.use("/course", courseRoute);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err });
});

app.listen(port, async () => {
  await dbo.connectToServer();
  console.log(`Server is running on port: ${port}`);
});
