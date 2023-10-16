import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { customAlphabet } from "nanoid";
import dbConnect from "@/utils/dbConnect";
import Notes from "@/models/Notes";

// inititalizing the id-length, and the generation for unique id using the 'nanoid' module
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let idLength = 6;
let nanoid = customAlphabet(alphabet, idLength);

export default async function handler(req, res) {
  // checks if user is logged in, if not redirects to home
  const session = await getServerSession(req, res, authOptions);

  if (!session || !req.body) {
    res.status(200).json({ answer: "Logged out!" });
    return;
  }

  // gets the data from the req.body, and the user's profile
  const { data, title, importance, date, noteID, whatToChange } = JSON.parse(req.body);
  const profile = session.user;
  
  await dbConnect();
  let id = noteID;
  // create an id until it is unique within the database
  // if there are three collisions, the id-length increases
  if (id === "create") {
    let collisions = 0;
    id = nanoid();
    let created = await Notes.findOne({ id: id });

    while (created) {
      collisions += 1
      if (collisions == 3) {
        collisions = 0;
        idLength += 1;
        nanoid = customAlphabet(alphabet, idLength);
      }
      id = nanoid();
      created = await Notes.findOne({ id: id });
    }
  }

  // if it is a new note, create a new document within the database
  if (noteID === "create") {
    let newNote = { id: id, email: profile.email, title: title, data: data, importance: importance, date: date };
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