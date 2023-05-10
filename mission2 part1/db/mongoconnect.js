const mongoose = require('mongoose');
const{config} = require("../config/secret")

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://localhost:27017/black22');
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.jymclmm.mongodb.net/hadassim`);
  console.log("mongo atlas connect hadassim")
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}