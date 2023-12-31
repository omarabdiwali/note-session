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
  // gets the note-id from the req.body, and the user's profile
  const { noteID } = JSON.parse(req.body);
  const profile = session.user;
  // creates a query, and connects to the database
  let query = { email: profile.email, id: noteID };
  await dbConnect();
  // finds the note using the query, and removes it from the database
  // sends if the deletion has been successful
  await Notes.findOneAndRemove(query);
  res.status(200).json({ answer: "Note has been deleted!", variant: "success" });
}