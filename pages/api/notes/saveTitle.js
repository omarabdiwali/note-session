import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Notes from "@/models/Notes";

export default async function handler(req, res) {
  // checks if user is logged in, if not redirects to home
  const session = await getServerSession(req, res, authOptions);

  if (!session || !req.body) {
    res.status(200).json({ answer: "Logged out!" });
    return;
  }
  // gets the note-id and note-title from the req.body, and the user's profile
  const { title, noteID } = JSON.parse(req.body);
  const profile = session.user;
  // creates a query, and connects to the database
  let query = { email: profile.email, id: noteID };
  await dbConnect();
  // searches through the database to find a match
  let note = await Notes.findOne(query);
  // if a match is found, it edits the title
  // otherwise, it reloads the page
  if (note) {
    note.title = title;
    note.save();
    res.status(200).json({ answer: "Saved" });
  }
  else {
    res.status(200).json({ answer: "Note does not exist." });
  }
}