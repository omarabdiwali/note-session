import { AiOutlinePlus } from "react-icons/ai";
import NoteTab from "./noteTab"
/** Creates a section for the different groupings. */
export default function NoteSection({ notes, title, remove, update, className }) {
  return (
    <div className={`flex-1 text-black bg-zinc-400 overflow-x-auto min-h-[15rem] max-h-[15rem] min-w-[20rem] w-[30rem] max-w-[30rem] ${className} rounded-lg shadow-2xl border border-b border-slate-500`}>
      <div className="flex text-lg p-3 m-3">
        <div className="flex-1">{title}</div>
        <a href={`/notes/create/${title}`} className="text-2xl m-auto"><AiOutlinePlus /></a>
      </div>
      <div className="flex flex-col mx-5">
        <div className="h-[9rem] max-h-[9rem] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-slate-700 scrollbar-track-inherit">
          {notes.map((note, _) => {
            return <NoteTab note={note} remove={remove} update={update} key={note.id} />
          })}
        </div>
      </div>
    </div>
  )
}