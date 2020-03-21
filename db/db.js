const dbconfig = require("../config/db.json");
const mongoose = require("mongoose");
mongoose
  .connect(dbconfig.connectionString, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log("DB Connected!"))
  .catch(err => {
    console.log(err);
  });
mongoose.Promise = global.Promise;

module.exports = {
  User: require("./models/User")
};
