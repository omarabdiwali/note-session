import { AiOutlineCheck, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import DeleteNote from "./deleteButton";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
/** The tab of the note shown on the home page. */
export default function NoteTab({ note, remove }) {
  const [title, setTitle] = useState(note.title);
  const [prevTitle, setPrevTitle] = useState(note.title);
  const [change, setChange] = useState(false);
  const [disabled, setDisabled] = useState(false);
  /** Saves the title of the note */
  const saveTitle = (e) => {
    e.preventDefault();
    // checks if the title has been changed
    if (title === prevTitle) {
      setTitle(prevTitle);
      setChange(false);
      return;
    }

    let curTitle = title;
    // if the title is empty, name it as 'Unititled Note'
    if (curTitle.length === 0) {
      setTitle("Untitled Note");
      curTitle = "Untitled Note";
    }

    setDisabled(true);
    // sends the title and note-id to the server to save the changes
    fetch("/api/notes/saveTitle", {
      method: "POST",
      body: JSON.stringify({ title: curTitle, noteID: note.id })
    }).then(res => res.json()).then(data => {
      if (data.answer === "Saved") {
        enqueueSnackbar("Title has been changed!", { variant: "success", autoHideDuration: 1500 });
        setPrevTitle(curTitle);
        setChange(false);
        setDisabled(false);
      } else if (data.answer === "Logged Out") {
        window.location.reload();
      } else {
        enqueueSnackbar(data.answer, { variant: "warning", autoHideDuration: 1500 });
        window.location.reload();
      }
    })
  }
  /** Allows or disables the editing of the title. */
  const changeType = (e) => {
    if (change) {
      saveTitle(e);
    }
    setChange(!change);
  }

  return (
    <div className="flex min-w-fit text-sm text-black mx-5 rounded-xl mb-3 my-auto border border-b border-slate-600 h-9 max-h-9">
      <DeleteNote disableButton={disabled} className={"ml-3 mr-2 m-auto text-lg"} func={() => remove(note)} button={<AiOutlineDelete />} noteId={note.id} />
      <button title={!change ? "Edit title" : "Save Title"} disabled={disabled} onClick={changeType} className="mr-5 my-auto text-lg">{!change ? <AiOutlineEdit /> : <AiOutlineCheck />}</button>
      <div className="pr-4 whitespace-nowrap my-auto flex-1">
        {!change ? <a href={`/notes/${note.id}`}>{title}</a> :
          <form onSubmit={saveTitle}>
            <input placeholder="Untitled Note" disabled={disabled} autoFocus className="bg-inherit placeholder:text-slate-900 outline-none" value={title} onChange={e => setTitle(e.target.value)} />
          </form>
        }
      </div>
    </div>
  )
}