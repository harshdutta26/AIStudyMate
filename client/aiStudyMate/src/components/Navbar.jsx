import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { MyContext } from './MyContext'
import { useContext } from 'react'

  
function Navbar() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
const { isLoggedIn, setIsLoggedIn,toggle,setToggle } = useContext(MyContext)
  async function Logout(){
            const res=await fetch(`${backendUrl}/Logout`);
            const data=await res.json();
            if(data.success){
                console.log('Logout');
                setIsLoggedIn(false);
            }
        }
  function handleToggle(){
    setToggle((prev)=>!prev)
    console.log('Toggling is ',toggle);
  }
  function handleToggleInvert(){
    setToggle((prev)=>!prev)
    console.log('Toggling is ',toggle);
  }
  return (
    <>
      {/* Navbar Container */}
      <div className={toggle? "w-full min-h-16 md:min-h-32 flex items-center justify-between px-6  bg-black text-white" : "w-full min-h-16 md:min-h-32 flex items-center justify-between px-6 bg-gray-900 text-white"}>
        {/* Logo */}
        <Link to='/'>
        <div className={toggle? "text-xl md:text-4xl lg:text-5xl font-bold text-[#FF6500] hover:text-[#ff6600d8]":"text-xl md:text-4xl lg:text-5xl font-bold text-[#FF6500] hover:text-[#ff6600e0]"}>
          AiStudyMate
        </div>
        </Link>
        {/* Nav Links */}
        <nav className="flex items-center justify-end  md:w-[calc(100vw-48px)] w-[calc(100vw-30px)]">
          <div className=" flex justify-between
          text-lg items-center md:text-2xl lg:text-3xl w-3/4 md:h-4/5 md:w-1/3">
            
            {!isLoggedIn && (
              
                <button className={toggle?"px-8 md:h-1/2 md:w-64 min-w-14 py-1 md:py-2  rounded-sm  md:rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-green-600 text-wrap text-sm md:text-4xl":"px-8 md:h-1/2 min-w-14 md:w-64 py-1  md:py-2 bg-[#B13BFF] rounded-sm md:rounded-md  text-white font-bold transition duration-200 hover:bg-[#a06bc4] text-wrap text-sm md:text-4xl"}>
                <Link to="/Login">Login</Link>
              </button>
              
            )}

            {isLoggedIn && (
              
                <button className={toggle?"px-8 md:h-1/2 md:w-64 min-w-14 py-1 md:py-2  rounded-sm  md:rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-green-600 text-wrap text-sm md:text-4xl":"px-8 md:h-1/2 min-w-14 md:w-64 py-1  md:py-2 bg-[#B13BFF] rounded-sm md:rounded-md  text-white font-bold transition duration-200 hover:bg-[#a06bc4] text-wrap text-sm md:text-4xl"}>
                <Link
                  to="/"
                  onClick={() => Logout()}>
                  Logout
                </Link>
              </button>
             
            )}
        {toggle? <button onClick={handleToggle}className={toggle?"px-8 md:h-1/2 md:w-64 min-w-14 py-1 md:py-2  rounded-sm  md:rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-green-600 text-wrap text-sm md:text-4xl":"px-8 md:h-1/2 min-w-14 md:w-64 py-1  md:py-2 bg-[#B13BFF] rounded-sm md:rounded-md  text-white font-bold transition duration-200 hover:bg-[#a06bc4] text-wrap text-sm md:text-4xl"}>Dark 🌙</button>
        :
                    <button onClick={handleToggleInvert}className={toggle?"px-8 md:h-1/2 md:w-64 min-w-14 py-1 md:py-2  rounded-sm  md:rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-green-600 text-wrap text-sm md:text-4xl":"px-8 md:h-1/2 min-w-14 md:w-64 py-1  md:py-2 bg-[#B13BFF] rounded-sm md:rounded-md  text-white font-bold transition duration-200 hover:bg-[#a06bc4] text-wrap text-sm md:text-4xl"}>Light ☀️</button>}
          </div>
        </nav>
      </div>

      {/* Page Content */}
      <Outlet />
    </>
  )
}

export default Navbar

