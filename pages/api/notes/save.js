import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Notes from "@/models/Notes";

let crypto = require("crypto");

export default async function handler(req, res) {
  // checks if user is logged in, if not redirects to home
  const session = await getServerSession(req, res, authOptions);

  if (!session || !req.body) {
    res.status(200).json({ answer: "Logged Out" });
    return;
  }

  // gets the data from the req.body, and the user's profile
  const { data, title, importance, date, noteID, whatToChange } = JSON.parse(req.body);
  const profile = session.user;
  
  await dbConnect();
  let id = noteID;
  // if it is a new note, create a unique id using 'crypto' module, and query the database using the id
  // if it has been found, create another id, and do it until it is unique within the database
  if (id === "create") {
    id = crypto.randomBytes(5).toString('hex');
    let created = await Notes.findOne({ id: id });

    while (created) {
      id = crypto.randomBytes(5).toString('hex');
      created = await Notes.findOne({ id: id });
    }
  }

  let newNote = { id: id, email: profile.email, title: title, data: data, importance: importance, date: date };
  // if it is a new note, create a new document within the database
  if (noteID === "create") {
    let note = await Notes.create(newNote).catch(err => console.error(err));
    res.status(200).json({ answer: "Saved", noteId: id, title: note.title, note: note.data, importance: note.importance });
  }
  
  else {
    // creates a query, and searches the database
    let query = { email: profile.email, id: id };
    let note = await Notes.findOne(query);
    // if there is no matches, note has been deleted and page reloads
    if (note === null) {
      res.status(200).json({ answer: "Changes have been made, reloading!" });
      return;
    }

    note.date = date;
    // changes the different values in the notes
    if (whatToChange.includes("N")) {
      note.data = data;
    } if (whatToChange.includes("I")) {
      note.importance = importance;
    } if (whatToChange.includes("T")) {
      note.title = title;
    }
    // saves it and sends the client the values
    note.save();
    res.status(200).json({ answer: "Saved", noteId: id, title: note.title, note: note.data, importance: note.importance });
  }
}