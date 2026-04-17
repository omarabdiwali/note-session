import { AiOutlineCheck, AiOutlineDelete, AiOutlineEdit, AiOutlineEllipsis } from "react-icons/ai";
import DeleteNote from "./deleteButton";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import ChangeSection from "./changeSections";

export default function NoteTab({ note, remove, update }) {
  const [title, setTitle] = useState(note.title);
  const [prevTitle, setPrevTitle] = useState(note.title);
  const [change, setChange] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const saveTitle = (e) => {
    e.preventDefault();
    if (title === prevTitle) {
      setTitle(prevTitle);
      setChange(false);
      return;
    }

    let curTitle = title.length === 0 ? "Untitled Note" : title;
    if (curTitle.length === 0) setTitle("Untitled Note");

    setDisabled(true);
    fetch("/api/notes/saveTitle", {
      method: "POST",
      body: JSON.stringify({ title: curTitle, noteID: note.id })
    }).then(res => res.json()).then(data => {
      if (data.answer === "Saved") {
        enqueueSnackbar("Title updated successfully", { variant: "success", autoHideDuration: 2000 });
        setPrevTitle(curTitle);
        setChange(false);
        setDisabled(false);
      } else {
        enqueueSnackbar(data.answer, { variant: "error", autoHideDuration: 2000 });
        window.location.reload();
      }
    })
  }

  const changeType = (e) => {
    if (change) saveTitle(e);
    setChange(!change);
  }

  return (
    <div className="group flex items-center w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-2xl p-2 transition-all duration-200">
      
      {/* Action Buttons Container (Left) */}
      <div className="flex items-center gap-1 mr-3 opacity-70 group-hover:opacity-100 transition-opacity">
        <DeleteNote 
          disableButton={disabled} 
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" 
          func={() => remove(note)} 
          button={<AiOutlineDelete className="text-lg" />} 
          noteId={note.id} 
        />
        <button 
          title={!change ? "Edit title" : "Save Title"} 
          disabled={disabled} 
          onClick={changeType} 
          className={`p-1.5 rounded-lg transition-colors ${change ? 'text-green-400 bg-green-500/10' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
        >
          {!change ? <AiOutlineEdit className="text-lg" /> : <AiOutlineCheck className="text-lg" />}
        </button>
      </div>

      {/* Title Area */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {!change ? (
          <a href={`/notes/${note.id}`} className="block truncate text-slate-200 hover:text-cyan-400 transition-colors text-sm font-medium">
            {title}
          </a>
        ) : (
          <form onSubmit={saveTitle} className="w-full">
            <input 
              placeholder="Untitled Note" 
              disabled={disabled} 
              autoFocus 
              className="w-full bg-transparent text-white border-b border-cyan-500/50 focus:border-cyan-400 outline-none text-sm font-medium px-1 py-0.5" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </form>
        )}
      </div>

      {/* Actions (Right) */}
      <ChangeSection 
        func={update} 
        className="p-1.5 ml-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors opacity-70 group-hover:opacity-100" 
        button={<AiOutlineEllipsis className="text-xl" />} 
        noteId={note.id} 
        important={note.importance} 
      />
    </div>
  )
}