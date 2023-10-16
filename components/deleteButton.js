import { enqueueSnackbar } from "notistack";
import { useState } from "react"

/** Button to delete the note. */
export default function DeleteNote({ func, className, button, noteId, onPage=false, disableButton=false }) {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);

  /** Deletes the note. */
  const deleteItem = (e) => {
    e.preventDefault();
    // button is disabled, then the id of the note is sent to the server to be deleted,
    // and the page redirects to home if it is currently on a '/note/*' page
    setDisabled(true);
    fetch("/api/notes/delete", {
      method: "POST",
      body: JSON.stringify({ noteID: noteId })
    }).then(res => res.json()).then(data => {
      enqueueSnackbar(data.answer, { variant: data.variant, autoHideDuration: 1500 });
      if (onPage) {
        setTimeout(() => window.location.href = "/", 500);
      } else {
        if (data.answer === "Note has been deleted!") {
          func();
          setOpen(false);
          setDisabled(false);
        } else {
          setTimeout(() => window.location.href = "/", 500);
        }
      }
    })
  }
  
  return (
    <>
      <button title="Delete Note" disabled={noteId === "create" || disableButton} onClick={() => setOpen(true)} className={className}>
        {button}
      </button>

      <div className={`cursor-auto ${!open ? "hidden" : ""} z-50`}>
        <div className={`fixed flex h-screen inset-0 z-50 transition-all duration-300 delay-150 ease-in-out ${!open ? "opacity-0 hidden" : "opacity-100"} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-96 max-h-full`}>
          <div className="relative m-auto w-full max-w-lg max-h-full">
            <div className="relative rounded-lg shadow bg-slate-700">
              <div className="text-2xl text-black font-bold p-3 m-3">Delete Note</div>
              <div className="text-lg text-black mx-5">
                Are you sure? You can&apos;t undo this action afterwards.
              </div>
              <div className="flex justify-end p-6 space-x-2 rounded-b border-gray-600">
                <button disabled={disabled} className="disabled:opacity-75 text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-600 disabled:bg-red-700 enabled:hover:bg-red-700 focus:ring-red-800" onClick={deleteItem}>Delete</button>
                <button disabled={disabled} className="disabled:opacity-75 focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600" onClick={() => setOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`cursor-auto overscroll-contain ml-0 w-screen opacity-25 fixed inset-0 z-10 bg-black ${!open ? "hidden" : ""}`}></div>
    </>
  )
}