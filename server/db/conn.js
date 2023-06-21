const mongoose = require("mongoose");
const Db = process.env.ATLAS_URI;

module.exports = {
  connectToServer: async function () {
    console.log(Db);
    mongoose
      .connect(`${Db}`, {
        family: 4,
      })
      .then(() => {
        console.log("Connected!");
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
