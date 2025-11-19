// import React from 'react'
// import { MyContext } from './MyContext'
// import { useContext } from 'react'
// function Footer() {
//   const {toggle}=useContext(MyContext);
//   return (
//     <div className={toggle?'border-4 border-black min-h-18 md:h-28 overflow-hidden bg-black':'border-4 border-black min-h-18 md:h-28 overflow-hidden bg-gray-900 text-[#DFD0B8]'}>
//       <footer className={toggle? 'bg-black text-white min-h-16 md:h-full' : 'bg-gray-900 text-white min-h-16 md:h-full'}>
//             Footer
//         </footer>
//     </div>
//   )
// }

// export default Footer

import React, { useContext } from 'react';
import { MyContext } from './MyContext';
import { Link, Outlet } from 'react-router-dom';

function Footer() {
  const { toggle } = useContext(MyContext);

  return (
    <div
      className={
        toggle
          ? "border-4 border-black min-h-18 md:h-28 overflow-hidden bg-black"
          : "border-4 border-black min-h-18 md:h-28 overflow-hidden bg-gray-900 text-[#DFD0B8]"
      }
    >
      <footer
        className={
          toggle
            ? "bg-black text-white min-h-16 md:h-full flex flex-col md:flex-row justify-between items-center px-4 py-2"
            : "bg-gray-900 text-white min-h-16 md:h-full flex flex-col md:flex-row justify-between items-center px-4 py-2"
        }
      >
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="md:text-xl text-lg font-bold">AI StudyMate</h2>
          <p className="text-sm md:text-lg">Your AI-powered study partner</p>
        </div>

        {/* Links */}
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link to='/' className="hover:underline text-lg md:text-xl" >Home</Link>
          <Link to='/' className="hover:underline text-lg md:text-xl" >About</Link>
          <Link to='/' className="hover:underline text-lg md:text-xl" >Contact</Link>          
          <Link to='/' className="hover:underline text-lg md:text-xl" >Privacy</Link>
          <Outlet/>
        </div>

        {/* Contact Info */}
        <div className="text-sm md:text-lg mt-2 md:mt-0 text-center md:text-right">
          <p>Email: support@aistudymate.com</p>
          <p>© {new Date().getFullYear()} AI StudyMate</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
