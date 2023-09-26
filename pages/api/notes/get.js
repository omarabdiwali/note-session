import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Notes from "@/models/Notes";

export default async function handler(req, res) {
  // checks if user is logged in, if not redirects to home
  const session = await getServerSession(req, res, authOptions);

  if (!session || !req.body) {
    res.status(200).json({ answer: "Reloading!" });
    return;
  }
  // gets the note-id from the req.body, and the user's profile
  const { noteID } = JSON.parse(req.body);
  const profile = session.user;
  // creates a query, and connects to the database
  let query = { id: noteID, email: profile.email };
  await dbConnect();
  // finds the note using the query, and if successful, sends the data to the client
  // else, it redirects the page to home
  let note = await Notes.findOne(query);
  
  if (note) {
    res.status(200).json({ note: note.data, importance: note.importance, title: note.title, answer: "Success" });
  }
  else {
    res.status(200).json({ answer: "Reloading!" });
  }
}