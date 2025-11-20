import React, { useContext, useState } from 'react'
import { MyContext } from './MyContext';
import { useNavigate } from 'react-router-dom';
function SignUp() {
  const {LoggedInUsername,setLoggedInUsername,isLoggedIn,setIsLoggedIn,toggle}=useContext(MyContext);
  const [username,setUsername]=useState('');
  const [emailId,setEmailId]=useState('');
  const [hashPassword,setHashPassword]=useState('');
  const navigate=useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
   async  function handleSignUp(e){
        try{
          e.preventDefault();
          console.log(`value of backend url is ${import.meta.env.VITE_BACKEND_URL}`)
        const res=await fetch(`${backendUrl}/SignUp`,{
          method:'POST',
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify
          ({
            username,emailId,hashPassword
          })
        });
        // const data=await res.json();
        // if(data.success){
        //   setUsername('');
        //   setEmailId('');
        //   setHashPassword('');
        //   setLoggedInUsername(data.username);
        //   setIsLoggedIn(true);
        //   navigate('/'); 
        // }

        let data;
try {
  data = await res.json();
} catch {
  console.log("Server did not return JSON");
  return;
}

if (!res.ok) {
  console.log("Error:", data.message);
  return;
}

if (data.success) {
  setUsername("");
  setEmailId("");
  setHashPassword("");
  setLoggedInUsername(data.username);
  setIsLoggedIn(true);
  navigate("/");
}

        }
        catch(err){
          console.log(`Error while submitting ${err}`);
        }
    }
  function handleChangeUsername(e){
    setLoggedInUsername(e.target.value);
    setUsername(e.target.value);
  }
  return (
 <div className={toggle? 'border-in min-h-[calc(100vh-136px)] md:min-h-[calc(100vh-240px)] flex items-center justify-center bg-[#E9E3DF]':'min-h-[calc(100vh-136px)] md:min-h-[calc(100vh-240px)] flex items-center justify-center bg-[#222]'}>
        <div className={toggle?' w-full  flex flex-col md:h-[1000px] flex-wrap ':' w-full  flex flex-wrap flex-col md:h-[1000px]'}>
          <div className='flex items-center justify-center  h-1/6 md:h-1/12'>
            <h2 className={toggle? 'text-xl md:text-4xl': 'text-xl md:text-4xl text-white'}>Join AI studyMate Now!</h2>
          </div>
          <div className='h-4/5 flex items-center flex-wrap justify-center'>

            <form className='rounded-lg p-4 flex flex-col gap-4 md:gap-6 shadow-lg text-lg md:text-4xl wd:2/3 md:w-1/2 border-2 border-black bg-white h-full mt-12' onSubmit={(e)=>handleSignUp(e)}>

            <div className='flex flex-col gap-1 md:gap-2 items-center justify-center'>
                          <label className='font-medium' htmlFor='usernameId'>Name</label>
            <input type="text" name='username' id='usernameId' className='border-2 border-black w-2/3 md:w-1/2  font-semibold md:text-3xl' value={username} onChange={(e)=>handleChangeUsername(e)} />
            </div>

                 <div className='flex flex-col gap-1 md:gap-2 items-center justify-center'>
                          <label className='font-medium' htmlFor='emailId'>Email Address</label>
            <input type="email" name='emailId'  className='border-2 border-black w-2/3 md:w-1/2 font-semibold md:text-3xl text-md' value={emailId} onChange={(e)=>setEmailId(e.target.value)} />
                </div>
            <div className='flex flex-col gap-1 md:gap-2 items-center justify-center'>
        <label className='font-medium'htmlFor="hashPassword">Password</label>
            <input type='password'  name='hashPassword' className='border-2 border-black w-2/3 md:w-1/2 text-md md:text-3xl font-semibold' value={hashPassword} onChange={(e)=>setHashPassword(e.target.value)}/>
      </div>
      
            <div className='flex flex-wrap items-center justify-center  h-12 md:h-16'>
              <button className='bg-yellow-400  w-28 md:w-44 text-white hover:bg-yellow-500 focus:ring-yellow-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900'>Submit</button>
            </div>
            
          </form>
          </div>
      </div>
    </div>
  )
}

export default SignUp
