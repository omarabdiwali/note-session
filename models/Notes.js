import mongoose, { Schema } from "mongoose";

let NoteScehma = new Schema({
  id: String,
  email: String,
  title: String,
  data: String,
  importance: String,
  date: Date
})

module.exports = mongoose.models.Notes || mongoose.model("Notes", NoteScehma);