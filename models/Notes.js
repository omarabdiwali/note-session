import mongoose, { Schema } from "mongoose";

let NoteScehma = new Schema({
  id: String,
  email: String,
  title: String,
  data: String,
  importance: String,
  date: Date
})

const Notes = mongoose.models.Notes || mongoose.model("Notes", NoteScehma);
export default Notes;