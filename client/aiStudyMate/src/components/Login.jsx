import React, { useContext, useState } from 'react'
import { Link,useNavigate,Outlet } from 'react-router-dom'
import { MyContext } from './MyContext';
function Login() {
  const {isLoggedIn,setIsLoggedIn,toggle,LoggedInUsername,setLoggedInUsername}=useContext(MyContext);
  const [emailId,setEmailId]=useState('');
const [hashPassword,setHashPassword]=useState('');
const navigate=useNavigate();

  async function handleSignIn(e){
    try{
      e.preventDefault();
      const res=await fetch('http://localhost:3000/Login',{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify
        ({
          emailId,hashPassword
        }),
        credentials:"include"
      });
      const data=await res.json();
      if(data.success){
        setEmailId('');
        setHashPassword(' ');
        console.log('Data sucess');
        setIsLoggedIn(true);
        setLoggedInUsername(data.username);
        navigate("/");
      }
    }
    catch(err){
      console.log(`Error in handleSignIn ${err}`);
    }
  }
  return (
    <div className={toggle? 'border-2 border-black min-h-[calc(100vh-136px)] md:min-h-[calc(100vh-240px)] flex items-center justify-center bg-[#E9E3DF]':'border-2 border-black min-h-[calc(100vh-136px)] md:min-h-[calc(100vh-240px)] flex items-center justify-center bg-[rgb(34,34,34)]'}>
        <div className={toggle?' w-full  flex flex-col md:h-[1000px] flex-wrap ':' w-full  flex flex-wrap flex-col md:h-[1000px]'}>
          <div className='flex items-center justify-center h-1/12'>
            <h2 className={toggle? ' text-xl md:text-4xl' : ' text-xl md:text-4xl text-white'}>Welcome Back!</h2>
          </div>
          <div className='h-4/5 flex items-center flex-wrap justify-center '>
            <form onSubmit={(e)=>handleSignIn(e)} className='rounded-lg p-4 flex flex-col gap-4 md:gap-6 shadow-lg text-lg md:text-5xl w-2/3 md:w-1/2 border-2 border-black bg-white h-full mt-12'>
              <div className='flex items-center justify-center'><h2>Sign In</h2></div>
          <div className='flex flex-col gap-0.5 md:gap-2 items-center justify-center'>
                          <label className='font-medium' htmlFor='emailId'>Email Address</label>
            <input className='border-2 border-black w-2/3 md:w-1/2 md:text-4xl text-sm font-semibold' type="emailid" name='emailId' value={emailId} onChange={(e)=>setEmailId(e.target.value)}/>
          </div>
    <div className='flex flex-col gap-0.5 md:gap-2 items-center justify-center'>
        <label className='font-medium'htmlFor="hashPassword">Password</label>
                  <input id='hashPassword' className='border-2 border-black w-2/3 md:w-1/2 text-sm md:text-4xl font-semibold' type='password' value={hashPassword} name='hashPassword' onChange={(e)=>setHashPassword(e.target.value)}/>
    </div>
            <div className='flex flex-wrap items-center justify-center h-12 mt-2 md:h-16 md:mt-4 '>
              <button className='bg-yellow-400  w-28 md:w-44 text-white hover:bg-yellow-500 focus:ring-yellow-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900'>Submit</button>
            </div>
            <div className=' flex  items-center justify-center font-semibold text-sm md:text-3xl mt-0.5 md:mt-2'>
              <p> Already have an account?
                <Link to='/SignUp' className='underline font-semibold' > Sign up</Link>
              </p>
            </div>
          </form>
          </div>
          <Outlet/>
        </div>
    </div>
  )
}

export default Login
