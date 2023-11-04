import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { AiOutlineDelete, AiOutlineSave, AiOutlineSync } from "react-icons/ai";
import { BsCloudCheck } from "react-icons/bs";
import DeleteNote from "./deleteButton";
import Head from "next/head";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import 'katex/dist/katex.min.css';
import HelpButton from "./helpButton";
/** Shows the text editor and its markdown equivalent. */
export default function EditingPage() {
  const router = useRouter();
  const { data: _, status } = useSession();

  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [noteId, setNoteId] = useState("create");
  const [importance, setImportance] = useState("");
  const [lastSavedNote, setLastSavedNote] = useState("");
  const [lastSavedImportance, setLastSavedImportance] = useState("");
  const [lastSavedTitle, setLastSavedTitle] = useState("");
  const [preview, setPreview] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [disable, setDisable] = useState(false);
  const [height, setHeight] = useState("100vh");

  const textArea = useRef();
  const header = useRef();

  const changeHeight = useCallback(e => {
    if (e === undefined || header.current === undefined) return;
    let hgt = header.current.offsetHeight;
    let height = window.innerHeight - hgt;
    setHeight(`${height}px`);
  }, [header])

  useEffect(() => {
    if (loaded && header.current !== undefined) {
      let hgt = header.current.offsetHeight;
      let height = window.innerHeight - hgt;
      setHeight(`${height}px`);
    }    
  }, [header, loaded]);

  useEffect(() => {
    window.addEventListener('resize', changeHeight);
    return () => {
      window.removeEventListener('resize', changeHeight);
    }
  }, [changeHeight])

  useEffect(() => {
    // status has to be authenticated to proceed, and router has to be ready
    if (status === "loading" || status === "unauthenticated") return;
    if (!router.isReady) return;
    // gets the id of the note
    let nteId = router.query.id[0];
    // sets the importance and urgent values of the note if the note is a new one
    if (router.query.id.length > 1 && nteId === "create") {
      let imp = router.query.id[1];
      let categories = ["Important & Urgent", "Important & Not Urgent", "Not Important & Urgent", "Not Important & Not Urgent"];
      if (categories.indexOf(imp) !== -1) {
        imp = imp.replaceAll(" ", "");
        imp = imp.replaceAll("&", "");
        imp = imp.replaceAll("NotImportant", "");
        imp = imp.replaceAll("NotUrgent", "");
        setImportance(imp);
        setLastSavedImportance(imp);
      }
    }
    // modifies the href to just show the id
    history.replaceState({}, "Title", `/notes/${nteId}`);
    // checks if note is new, or if the data needs to be fetched
    if (nteId == "create") {
      setPreview(false);
      setLoaded(true);
      setTitle("Untitled Note");
      setLastSavedNote("Untitled Note");
      return;
    } else {
      setPreview(true);
      setNoteId(nteId);
    }
    // fetches the note data using the id, and saves it to its corresponding variables
    fetch("/api/notes/get", {
      method: "POST",
      body: JSON.stringify({ noteID: nteId })
    }).then(res => res.json()).then(data => {
      if (data.answer === "Success") {
        setNote(data.note);
        setLastSavedNote(data.note);
        setImportance(data.importance);
        setLastSavedImportance(data.importance);
        setTitle(data.title);
        setLastSavedTitle(data.title);
        setLoaded(true);
      } else {
        enqueueSnackbar(data.answer, { variant: "warning", autoHideDuration: 1500 });
        setTimeout(() => window.location.href = "/", 500);
      }
    })

  }, [router.isReady, status])
  // redirects to home page if user is not signed in
  if (status === "unauthenticated") {
    window.location.href = "/";
  }
  // shows a loading aninmation when page is not finished
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
  /** Saves the current note. */
  const saveNote = (e) => {   
    e.preventDefault();
    let whatToChange = "";
    // blurs the element if user uses the enter key to save the title
    if (document.activeElement.tagName.toLowerCase() === "input") {
      document.activeElement.blur();
    }
    // checks what has been changed, and adds it to the variable
    if (note !== lastSavedNote) {
      whatToChange += "N";
    } if (importance !== lastSavedImportance) {
      whatToChange += "I";
    } if (title !== lastSavedTitle) {
      whatToChange += "T";
    }
    // if nothings been changed, return
    if (whatToChange.length === 0) return;
    // creates the object for the body of the request
    setDisable(true);
    
    let reqBody = {
      data: note, title: title, importance: importance,
      date: new Date(), noteID: noteId, whatToChange: whatToChange
    };
    // POST's the changes to the server, if the note is saved, it returns the values,
    // and it is saved to the appropriate variables. If something went wrong or user 
    // is logged out, the page redirects to the home page.
    fetch("/api/notes/save", {
      method: "POST",
      body: JSON.stringify(reqBody)
    }).then(res => res.json()).then(data => {
      if (data.answer === "Saved") {
        setImportance(data.importance);
        setLastSavedImportance(data.importance);
        setNote(data.note);
        setLastSavedNote(data.note);
        setTitle(data.title);
        setLastSavedTitle(data.title);
        if (noteId === "create") {
          setNoteId(data.noteId);
          history.replaceState({}, "Title", `/notes/${data.noteId}`);
        }
      } else {
        enqueueSnackbar(data.answer, { variant: "warning", autoHideDuration: 1500 });
        window.location.href = "/";
      }
      setDisable(false);
    })
  }

  /** Allows for the tab key to work within the text area, also lets user save by using ctrl+s. */
  const keyDown = (e) => {
    // lets the user tab, adding four spaces
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      // gets the value and location of the start and end of the selection
      const value = e.target.value;
      const selectionStart = e.target.selectionStart;
      const selectionEnd = e.target.selectionEnd;
      // adds four spaces to the value, and increases the start and end of the selection
      e.target.value =
        value.substring(0, selectionStart) + '    ' + value.substring(selectionEnd);
      e.target.selectionStart = selectionEnd + 4 - (selectionEnd - selectionStart);
      e.target.selectionEnd = selectionEnd + 4 - (selectionEnd - selectionStart);
    }
   
    // lets the user back tab, removing four spaces
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      // gets the value and location of the start and end of the selection
      const value = e.target.value;
      const selectionStart = e.target.selectionStart;
      const selectionEnd = e.target.selectionEnd;
      // gets the value before the start of the selection
      const beforeStart = value
        .substring(0, selectionStart)
        .split('')
        .reverse()
        .join('');
      const indexOfTab = beforeStart.indexOf('  ');
      const indexOfNewline = beforeStart.indexOf('\n');
      
      // removes four spaces to the value, and decreases the start and end of the selection
      if (indexOfTab !== -1 && indexOfTab < indexOfNewline) {
        e.target.value =
          beforeStart
            .substring(indexOfTab + 4)
            .split('')
            .reverse()
            .join('') +
          beforeStart
            .substring(0, indexOfTab)
            .split('')
            .reverse()
            .join('') +
          value.substring(selectionEnd);
  
        e.target.selectionStart = selectionStart - 4;
        e.target.selectionEnd = selectionEnd - 4;
      }
    }
    // allows the user to save using ctrl+s
    if (e.key === "s" && e.ctrlKey) {
      e.preventDefault();
      saveNote(e);
    }
  }

  /** Allows for the note to be copied to clipboard. */
  const copyNote = () => {
    navigator.clipboard.writeText(textArea.current.value);
    enqueueSnackbar("Note has been copied!", { variant: "info", autoHideDuration: 1000 });
  }

  /** Handles the change of importance and urgency of the note. */
  const handleImp = (e) => {
    e.preventDefault();
    let cpyImp = importance;

    // Checks if the select tag is regarding the importance or ungence, and adds or removes it
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
      <Head>
        <title>{lastSavedTitle.length === 0 ? "Untitled Note - NoteSession" : `${lastSavedTitle} - NoteSession`}</title>
      </Head>
      {loaded ? (
        <div className={`mb-0`}>
          <div ref={header} className={`flex scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-slate-700 scrollbar-track-inherit p-2 overflow-x-auto ${preview ? "mb-2" : ""}`}>
            <form onSubmit={saveNote}>
              <input disabled={preview} className="bg-inherit text-slate-400 mx-2 p-2 max-w-[20rem]" placeholder="Untitled Note" value={title} onChange={(e) => setTitle(e.target.value)}></input>
            </form>
            <div className={`my-auto pl-4 text-xl text-slate-400 opacity-75 ${(lastSavedNote !== note || lastSavedImportance !== importance || lastSavedTitle !== title) && !disable ? "hidden" : ""}`}>{disable ? <AiOutlineSync /> : <BsCloudCheck />}</div>
            <div className="text-slate-400 opacity-75 text-xs m-auto ml-2">{note !== lastSavedNote || title !== lastSavedTitle || importance.length !== lastSavedImportance.length ? disable ? "Saving..." : "Unsaved Changes" : ""}</div>
            <div className={`flex text-white flex-1 justify-end`}>
              <select disabled={preview} onChange={handleImp} className="mr-4 text-white text-sm bg-inherit focus:outline-none">
                <option className="text-black" selected={importance.includes("Important")} value={"High Importance"}>Importance: High</option>
                <option className="text-black" selected={importance.includes("Important") === false} value={"Low Importance"}>Importance: Low</option>
              </select>
              <select disabled={preview} onChange={handleImp} className="mr-4 text-white text-sm bg-inherit focus:outline-none">
                <option className="text-black" selected={importance.includes("Urgent")} value={"High Urgency"}>Urgency: High</option>
                <option className="text-black" selected={importance.includes("Urgent") === false} value={"Low Urgency"}>Urgency: Low</option>
              </select>
              <button className="text-slate-400 mr-2 font-bold uppercase text-sm" onClick={() => setPreview(!preview)}>{preview ? "Editor" : "Preview"}</button>
              <button onClick={copyNote} disabled={note.length === 0 || preview} className={`${preview ? "hidden" : ""} text-slate-400 mr-2 text-sm my-auto disabled:opacity-60 font-bold uppercase`}>Copy</button>
              <DeleteNote func={() => window.location.reload()} button={<AiOutlineDelete />} className={`disabled:opacity-60 mr-2 text-2xl`} noteId={noteId} onPage={true} />
              <button onClick={saveNote} className={`disabled:opacity-60 text-2xl mr-2`} disabled={(note === lastSavedNote && importance.length === lastSavedImportance.length && title === lastSavedTitle) || disable}><AiOutlineSave /></button>
              <HelpButton />
            </div>
          </div>
          {!preview ? (
            <div style={{minHeight: height, maxHeight: height}} className={`flex pb-6 pt-2 px-4`}>
              <textarea ref={textArea} onKeyDown={keyDown} spellCheck={false} className={`text-black flex-1 p-3 rounded-lg bg-gray-500`} placeholder="Start writitng your note..." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            </div>
          ) : (
            <div className="w-full pb-6 pt-2 px-4 rounded-lg min-w-full bg-slate-700">
              <ReactMarkdown components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      language={match[1]}
                      style={nightOwl}
                      PreTag="div"
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                }
              }} className="prose markdown min-h-screen min-w-full text-white" children={note} remarkPlugins={[[remarkGfm, {singleTilde: false}], remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]} />
            </div>
          )}
        </div>
      ) : "" }
    </>
  )
}