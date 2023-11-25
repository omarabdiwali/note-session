import NoteSection from "@/components/noteSection";
import Toolbar from "@/components/toolbar";
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Home() {
  const { data: _, status } = useSession();
  
  const [loaded, setLoaded] = useState(false);
  const [notes, setNotes] = useState([]);
  const [both, setBoth] = useState([]);
  
  const [important, setImportant] = useState([]);
  const [urgent, setUrgent] = useState([]);
  const [none, setNone] = useState([]);
  
  const categories = ["Important & Urgent", "Not Important & Urgent", "Important & Not Urgent", "Not Important & Not Urgent"];

  useEffect(() => {
    // status has to be authenticated to proceed
    if (status === "loading" || status === "unauthenticated") return;
    /** Groups the notes based on their important and urgent levels. */
    const groupNotes = async (notes) => {
      let b = [];
      let i = [];
      let u = [];
      let n = [];
      // goes through the array of notes, and adds them to their corresponding variables
      await Promise.all(notes.map((note, _) => {
        if (note.importance.length == 15) {
          b.push(note);
        } else if (note.importance.length == 9) {
          i.push(note);
        } else if (note.importance.length == 6) {
          u.push(note);
        } else {
          n.push(note);
        }
      }))
      // saves them to their 'useState' variables
      setBoth(b);
      setImportant(i);
      setUrgent(u);
      setNone(n)
    }
    // fetchs all the user's notes, and groups them, then loads the page
    fetch("/api/getNotes",).then(res => res.json()).then(data => {
      setNotes(data.notes);
      groupNotes(data.notes).then(() => {
        setLoaded(true);
      })
    }).catch(err => console.error(err));

  }, [status])

  const changeOrDelete = (arr, id, note, del) => {
    if (del) {
      let ind = arr.findIndex(nte => nte.id === id)
      arr.splice(ind, 1);
    } else {
      arr.push(note)
    }
    return arr;
  }

  const findAndUpdateNote = (importance, id, note, del=true) => {
    if (importance.length == 15) {
      let bth = [...both];
      bth = changeOrDelete(bth, id, note, del);
      setBoth(bth);
    } else if (importance.length === 9) {
      let imp = [...important];
      imp = changeOrDelete(imp, id, note, del);
      setImportant(imp);
    } else if (importance.length === 6) {
      let urg = [...urgent];
      urg = changeOrDelete(urg, id, note, del);
      setUrgent(urg);
    } else {
      let non = [...none];
      non = changeOrDelete(non, id, note, del);
      setNone(non);
    }
  }

  /** Deletes the note from all the notes and the corresponding group. */
  const deleteNote = (note) => {
    // creates the copy of all the notes and removes the deleted note using the index
    let nts = [...notes];
    let index = nts.findIndex(nte => nte.id === note.id);
    nts.splice(index, 1);
    // checks which group it belongs to, removes it using the index, and saves the new list
    findAndUpdateNote(note.importance, note.id, note);
    setNotes(nts);
  }

  const updateNote = (id, importance) => {
    let nts = [...notes];
    let index = nts.findIndex(nte => nte.id === id);
    let prevImp = nts[index].importance;
    nts[index].importance = importance;
    findAndUpdateNote(prevImp, id, nts[index]);
    findAndUpdateNote(importance, id, nts[index], false);
  }

  // shows loading symbol while waiting for the load
  if (status !== "unauthenticated" && !loaded) {
    return (
      <div className="flex h-screen">
        <div className="m-auto">
          <svg className="animate-spin h-10 w-10 mr-3 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }
  // home page when user is not logged in
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col">
        <Toolbar signedIn={false} />
        <div className="flex-1">
          <div className="mt-24">
            <center>
              <div className="text-5xl mb-8 font-bold text-gold">Effortless Note-Taking with NoteSession</div>
              <div className="text-xl text-gold">Create, organize, and access your notes anytime, anywhere.</div>
            </center>
          </div>
          <div className="grid grid-cols-2 gap-8 mx-5 mt-16">
            <div className="border border-2 border-gold rounded-xl p-3 min-h-[8rem]">
              <center>
                <div className="text-gold text-2xl font-bold">Markdown Syntax</div>
                <div className="text-gold text-md mt-4">Take notes using Markdown syntax for easy formatting and organization.</div>
              </center>
            </div>
            <div className="border border-2 border-gold rounded-xl p-3 min-h-[8rem]">
              <center>
                <div className="text-gold text-2xl font-bold">Cross-Device Sync</div>
                <div className="text-gold text-lg mt-4">Access your notes on any device and sync your data seamlessly.</div>
              </center>
            </div>
          </div>
          <div className="mt-20">
            <center>
              <div className="text-5xl mb-8 font-bold text-gold">Start Taking Notes with NoteSession Today!</div>
              <button onClick={() => signIn("google")} className="w-1/3 border-solid border-2 border-gold rounded-xl text-base p-2 pb-3 hover:bg-black hover:text-gold bg-inherit text-slate-400">
                Sign In With Google
              </button>
            </center>
          </div>
        </div>
        <div className="mt-12 text-gold text-lg mb-2">
          <center>
            &copy; 2023 NoteSession. All rights reserved.
          </center>
        </div>
      </div>
    )
  }


  return (
    <>
      <Toolbar />
      <div className="flex min-h-screen flex-col px-5 pt-6 overflow-x-auto">
        <div className="flex-1 flex p-3">
          {categories.slice(0, 2).map((cat, i) => {
            return <NoteSection className={i == 0 ? "ml-auto mr-5 my-auto" : "ml-5 my-auto mr-auto"} notes={i == 0 ? both : urgent} title={cat} update={updateNote} remove={deleteNote} key={i} />
          })}
        </div>
        <div className="flex-1 flex p-3">
          {categories.slice(2).map((cat, i) => {
            return <NoteSection className={i == 0 ? "ml-auto mr-5" : "ml-5 mr-auto"} notes={i == 0 ? important : none} title={cat} update={updateNote} remove={deleteNote} key={i + 2} />
          })}
        </div>
      </div>
    </>
  )
}
