import { useState } from "react";
import { AiOutlineClose, AiOutlineQuestionCircle } from "react-icons/ai";

export default function HelpButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="text-white font-bold uppercase text-2xl rounded shadow hover:shadow-lg outline-none focus:outline-none my-auto ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <AiOutlineQuestionCircle />
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center overscroll-contain items-center flex overflow-x-hidden scrollbar-none fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto min-w-[50rem] pt-8 max-h-screen max-w-[50rem]">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-black rounded-t">
                  <h3 className="text-3xl text-black font-semibold">
                    Help
                  </h3>
                  <button className="my-auto text-2xl text-black hover:text-white" onClick={() => setShowModal(false)}>
                    <AiOutlineClose />
                  </button>
                </div>
                <div className="relative max-h-full w-full h-full p-6 flex-auto">
                  <div>This uses <span><a rel="noopener norefferrer" target="__blank" className="text-blue-400 hover:underline" href="https://www.markdownguide.org/cheat-sheet/">Markdown</a></span> syntax</div>
                  <div>For code syntax highlighting, add coding language. Ex.</div>
                  <br></br>
                  <div>```js</div>
                  <div className="ml-5">console.log('It works!')</div>
                  <div>```</div>
                  <br></br>
                  <div>Math: <span><a rel="noopener norefferrer" target="__blank" className="text-blue-400 hover:underline"  href="https://katex.org/docs/support_table.html">Katex</a></span> syntax, surrounded by dollar signs ($[syntax]$)</div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  )
}