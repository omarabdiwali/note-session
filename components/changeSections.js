import { enqueueSnackbar } from "notistack";
import { useState } from "react"

/** Button to delete the note. */
export default function ChangeSection({ func, className, button, noteId, important }) {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [importance, setImportance] = useState(important);

  /** Updates the note. */
  const updateItem = (e) => {
    e.preventDefault();
    setDisabled(true);
    // button is disabled, then the id of the note is sent to the server to be updated,
    if (important.length === importance.length) return;

    let reqBody = {
      data: "", title: "", importance: importance,
      date: new Date(), noteID: noteId, whatToChange: "I"
    };

    fetch("/api/notes/save", {
      method: "POST",
      body: JSON.stringify(reqBody)
    }).then(res => res.json()).then(_ => {
      enqueueSnackbar("Note has been changed!", { variant: "success", autoHideDuration: 1500 });
      func(noteId, importance);
      setOpen(false);
      setDisabled(false);
    })
  }

  const closeModal = () => {
    setImportance(important);
    setOpen(false);
  }

  const changeImportance = (e) => {
    e.preventDefault();
    let cpyImp = importance;

    // Checks if the select tag is regarding the importance or urgency, and adds or removes it
    if (e.target.value.includes("Importance")) {
      if (e.target.value.includes("High") && cpyImp.includes("Important") === false) {
        cpyImp += "Important";
      } else if (e.target.value.includes("Low") && cpyImp.includes("Important") === true) {
        cpyImp = cpyImp.replace("Important", "");
      }
    } else {
      if (e.target.value.includes("High") && cpyImp.includes("Urgent") === false) {
        cpyImp += "Urgent";
      } else if (e.target.value.includes("Low") && cpyImp.includes("Urgent") === true) {
        cpyImp = cpyImp.replace("Urgent", "");
      }
    }
    setImportance(cpyImp);
  }
  
  return (
    <>
      <button title="Change Section" onClick={() => setOpen(true)} className={className}>
        {button}
      </button>

      <div className={`cursor-auto ${!open ? "hidden" : ""} z-50`}>
        <div className={`fixed flex h-screen inset-0 z-50 transition-all duration-300 delay-150 ease-in-out ${!open ? "opacity-0 hidden" : "opacity-100"} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-96 max-h-full`}>
          <div className="relative m-auto w-full max-w-lg max-h-full">
            <div className="relative rounded-lg shadow bg-gray-400 text-black opacity">
              <div className="text-2xl font-bold p-3 m-3">Change Section</div>
              <div className="text-lg mx-5">
                <div className="border-b border-black m-3 text-left">
                  <select onChange={changeImportance} className="mr-4 w-full bg-inherit focus:outline-none">
                    <option selected={importance.includes("Important")} value={"High Importance"}>Importance: High</option>
                    <option selected={importance.includes("Important") === false} value={"Low Importance"}>Importance: Low</option>
                  </select>
                </div>
                <div className="border-b border-black m-3 text-left">
                  <select onChange={changeImportance} className="mr-4 w-full bg-inherit focus:outline-none">
                    <option selected={importance.includes("Urgent")} value={"High Urgency"}>Urgency: High</option>
                    <option selected={importance.includes("Urgent") === false} value={"Low Urgency"}>Urgency: Low</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end p-6 space-x-2 rounded-b border-gray-600">
                <button disabled={disabled || important.length === importance.length} className="disabled:opacity-60 text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 disabled:bg-green-700 enabled:hover:bg-green-700 focus:ring-green-800" onClick={updateItem}>Save</button>
                <button disabled={disabled} className="disabled:opacity-75 focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-800 text-gray-300 border-gray-500 hover:text-white hover:bg-black focus:ring-gray-600" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`cursor-auto overscroll-contain ml-0 w-screen opacity-25 fixed inset-0 z-10 bg-black ${!open ? "hidden" : ""}`}></div>
    </>
  )
}