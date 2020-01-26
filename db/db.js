const config = require("../config.json");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI || config.connectionString, {
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
