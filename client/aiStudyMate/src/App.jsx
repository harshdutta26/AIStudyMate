import React ,{ useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './components/Home'
import Mcq from './components/Mcq';
import Navbar from './components/Navbar';
import Summary from './components/Summary';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import { MyContext } from './components/MyContext';

function App() {

  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [LoggedInUsername,setLoggedInUsername]=useState('');
  const [toggle,setToggle]=useState(false);
  return (
    <div className='min-h-screen w-full flex flex-col font-bold border-2 border-amber-300'>

    <MyContext.Provider value={{isLoggedIn,setIsLoggedIn,LoggedInUsername,setLoggedInUsername,toggle,setToggle}}>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Mcq' element={<Mcq/>}/>
      <Route path='/Summary' element={<Summary/>} />
      <Route path='/Login' element={<Login/>}/>
      <Route  path='/SignUp' element={<SignUp/>}/>
    </Routes>
    <Footer/>
  </BrowserRouter>
    </MyContext.Provider>
    </div>
  )
}

export default App
