import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import dbConnect from "@/utils/dbConnect";
import Notes from "@/models/Notes";

export default async function handler(req, res) {
  // checks if user is logged in, if not redirects to home
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(200).json({ answer: "Reload" });
    return;
  }
  // gets users data, creates a query, and connects to the database
  const profile = session.user;
  let query = { email: profile.email };  
  await dbConnect();
  // finds all the notes made by the user, and sends it to the client
  let notes = await Notes.find(query);
  res.status(200).json({ notes: notes });
}