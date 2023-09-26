// import { useState } from "react";
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import remarkMath from "remark-math";
// import rehypeRaw from "rehype-raw";
// import rehypeKatex from 'rehype-katex';

// import 'katex/dist/katex.min.css'
// import { AiOutlineClose } from "react-icons/ai";

// export default function PreviewButton({ note }) {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <>
//       <button
//         className="text-slate-400 font-bold uppercase text-sm rounded shadow hover:shadow-lg outline-none focus:outline-none my-auto ease-linear transition-all duration-150"
//         type="button"
//         onClick={() => setShowModal(true)}
//       >
//         Preview
//       </button>
//       {showModal ? (
//         <>
//           <div
//             className="justify-center overscroll-contain items-center flex overflow-x-hidden scrollbar-none fixed inset-0 z-50 outline-none focus:outline-none"
//           >
//             <div className="relative w-auto my-6 mx-auto min-w-[50rem] pt-8 max-h-screen max-w-[50rem]">
//               <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none">
//                 <div className="flex items-start justify-between p-5 border-b border-solid border-black rounded-t">
//                   <h3 className="text-3xl text-black font-semibold">
//                     Preview
//                   </h3>
//                   <button className="my-auto text-2xl text-black hover:text-white" onClick={() => setShowModal(false)}>
//                     <AiOutlineClose />
//                   </button>
//                 </div>
//                 <div className="relative max-h-full w-full h-full p-6 flex-auto">
//                   <ReactMarkdown components={{
//                     code({node, inline, className, children, ...props}) {
//                     const match = /language-(\w+)/.exec(className || '')
//                     return !inline && match ? (
//                       <SyntaxHighlighter
//                         {...props}
//                         children={String(children).replace(/\n$/, '')}
//                         language={match[1]}
//                         style={dark}
//                         PreTag="div"
//                       />
//                     ) : (
//                       <code {...props} className={className}>
//                         {children}
//                       </code>
//                     )
//                   }
//                   }} className="prose w-full min-w-full text-black" children={note} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]} />
//                 </div>
//                 <div className="flex items-center justify-end p-6 rounded-b">
//                   <button className="disabled:opacity-75 focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600" onClick={() => setShowModal(false)}>Close</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//         </>
//       ) : null}
//     </>
//   )
// }