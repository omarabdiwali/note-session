import mongoose, { Schema } from "mongoose";

let UserSchema = new Schema({
  name: String,
  email: String,
})

module.exports = mongoose.models.Users || mongoose.model("Users", UserSchema);