import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { MyContext } from './MyContext'
function Mcq() {
   const [resMcq,setResMcq]=useState('')
   const {isLoggedIn,setIsLoggedIn,toggle}=useContext(MyContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
 useEffect(()=>{
  async function fetchMcq(){
  if(isLoggedIn){
    try{
      const res=await fetch(`${backendUrl}/Mcq`,{method:'GET',credentials:'include'});
  const data=await res.json();
  if(data.success && data.mcq){
    console.log('data caught')
    const questions=data.mcq;
    const [questionsPart]=questions.split("/---\s*\*\*Answer Key/i");
    const formattedQuestions = questionsPart.trim();
    setResMcq(formattedQuestions);
  }
    }
    catch(err){console.log(`Error in fetching Mcqs ${err}`);}
  }
}
fetchMcq()
 },[])

  return (
    <div className='min-h-[calc(100vh-224px)]'>
        <div>
            <div className='text-2xl md:text-3xl'>
              <span className='text-3xl md:text-4xl font-bold'>Questions are</span> {resMcq}
            </div>
        </div>
    </div>
  )
}

export default Mcq
