import { signIn, signOut } from "next-auth/react";

export default function Toolbar({ signedIn = true, className = "" }) {  
  return (
    <header className={`w-full sticky top-0 z-50 border-b border-white/[0.05] bg-slate-950/60 backdrop-blur-md ${className}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          onClick={() => window.location.href = "/"} 
          className="cursor-pointer text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
        >
          NoteSession
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={signedIn ? () => signOut() : () => signIn("google")} 
            className="text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300 ease-out 
              text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 border border-transparent hover:border-white/10"
          >
            {signedIn ? "Sign Out" : "Sign In"}
          </button>
        </div>
      </div>
    </header>
  )
}