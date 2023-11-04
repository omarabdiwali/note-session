import { signIn, signOut } from "next-auth/react";
/** Toolbar on the home page. */
export default function Toolbar({ signedIn = true }) {  
  return (
    <div>
      <div className={`my-5 flex flex-row text-black m-3 h-8`}>
        <div onClick={() => window.location.href = "/"} className="cursor-pointer text-xl text-slate-400 font-extrabold">
          NoteSession
        </div>
        <div className={`flex flex-row flex-1 justify-end`}>
          <div onClick={signedIn ? () => signOut() : () => signIn("google")} className="cursor-pointer mx-4 my-auto hover:text-gold text-slate-400 font-semibold px-5">
            {signedIn ? "Sign Out" : "Sign In"}
          </div>
        </div>
      </div>
    </div>
  )
}