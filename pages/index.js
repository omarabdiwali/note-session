import NoteSection from "@/components/noteSection";
import Toolbar from "@/components/toolbar";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
    if (status === "loading" || status === "unauthenticated") return;
    
    const groupNotes = async (notes) => {
      let b = [];
      let i = [];
      let u = [];
      let n = [];
      await Promise.all(notes.map((note, _) => {
        if (note.importance.length == 15) b.push(note);
        else if (note.importance.length == 9) i.push(note);
        else if (note.importance.length == 6) u.push(note);
        else n.push(note);
      }));
      setBoth(b);
      setImportant(i);
      setUrgent(u);
      setNone(n)
    }
    fetch("/api/getNotes").then(res => res.json()).then(data => {
      setNotes(data.notes);
      groupNotes(data.notes).then(() => setLoaded(true));
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
      setBoth(changeOrDelete([...both], id, note, del));
    } else if (importance.length === 9) {
      setImportant(changeOrDelete([...important], id, note, del));
    } else if (importance.length === 6) {
      setUrgent(changeOrDelete([...urgent], id, note, del));
    } else {
      setNone(changeOrDelete([...none], id, note, del));
    }
  }

  const deleteNote = (note) => {
    let nts = [...notes];
    let index = nts.findIndex(nte => nte.id === note.id);
    nts.splice(index, 1);
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

  // Modern Loading Screen
  if (status !== "unauthenticated" && !loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin animation-delay-150"></div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col font-sans text-slate-200 relative overflow-hidden selection:bg-cyan-500/30">
        {/* Subtle ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-slate-950 to-transparent blur-3xl"></div>

        {/* Assuming your Toolbar accepts standard classNames */}
        <Toolbar signedIn={false} className="relative z-10" />

        <main className="flex-1 flex flex-col justify-center items-center px-6 w-full max-w-5xl mx-auto py-20 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center flex flex-col items-center">
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6">
              Capture thoughts. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Master your mind.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              Effortless note-taking, intuitively organized. Access your brilliant ideas from anywhere, instantly categorized by what matters most.
            </p>
            
            <button
              onClick={() => signIn("google")}
              className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 ease-out hover:shadow-[0_0_2rem_-0.5rem_#06b6d4] active:scale-95"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3 font-semibold text-slate-200 group-hover:text-white">
                {/* Inline SVG for Google logo for a cleaner button look */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </span>
            </button>
          </div>

          {/* Features Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-24">
            
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-md group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-100 mb-3">Intelligent Priorities</h2>
              <p className="text-slate-400 leading-relaxed">
                Categorize your notes by importance and urgency. Our system naturally surfaces what you need to focus on next.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-md group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-100 mb-3">Ubiquitous Access</h2>
              <p className="text-slate-400 leading-relaxed">
                Seamlessly sync across all your devices. Your second brain is securely backed up and always just a tap away.
              </p>
            </div>

          </div>
        </main>

        <footer className="w-full py-8 text-center text-sm text-slate-600 relative z-10 border-t border-white/[0.05]">
          &copy; {new Date().getFullYear()} NoteSession. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-200 relative overflow-hidden selection:bg-cyan-500/30 flex flex-col">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600 via-slate-950 to-transparent blur-3xl"></div>
      
      <Toolbar signedIn={true} className="relative z-10" />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 relative z-10 flex flex-col">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-slate-100">Your Matrix</h1>
          <p className="text-slate-400 mt-1 text-sm">Organize your thoughts by priority and urgency.</p>
        </div>

        {/* 2x2 Grid Layout for the Eisenhower Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 auto-rows-fr">
          <NoteSection notes={both} title={categories[0]} update={updateNote} remove={deleteNote} />
          <NoteSection notes={urgent} title={categories[1]} update={updateNote} remove={deleteNote} />
          <NoteSection notes={important} title={categories[2]} update={updateNote} remove={deleteNote} />
          <NoteSection notes={none} title={categories[3]} update={updateNote} remove={deleteNote} />
        </div>
      </main>
    </div>
  )
}