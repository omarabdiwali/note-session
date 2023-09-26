import { signOut } from "next-auth/react";
/** Toolbar on the home page. */
export default function Toolbar() {  
  return (
    <nav>
      <div className={`my-5 flex flex-row text-black m-3 h-8`}>
        <div onClick={() => window.location.href = "/"} className="cursor-pointer text-xl text-slate-400 font-extrabold">
          NoteSession
        </div>
        <div className={`flex flex-row flex-1 justify-end`}>
          <div onClick={() => signOut()} className="cursor-pointer mx-4 my-auto hover:text-gray-400 text-white font-semibold px-5">
            Sign Out
          </div>
        </div>
      </div>
    </nav>
  )
}