import { AiOutlinePlus } from "react-icons/ai";
import NoteTab from "./noteTab"

export default function NoteSection({ notes, title, remove, update, className = "" }) {
  return (
    <div className={`flex flex-col rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm overflow-hidden h-[350px] lg:h-auto ${className}`}>
      
      {/* Header Area */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05] bg-white/[0.01]">
        <h2 className="text-lg font-semibold text-slate-200 tracking-wide">{title}</h2>
        <a 
          href={`/notes/create/${title}`} 
          className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-300"
          title="Create new note"
        >
          <AiOutlinePlus className="text-xl" />
        </a>
      </div>

      {/* Notes List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
        {notes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
            No notes in this section yet.
          </div>
        ) : (
          notes.map((note) => (
            <NoteTab note={note} remove={remove} update={update} key={note.id} />
          ))
        )}
      </div>
    </div>
  )
}