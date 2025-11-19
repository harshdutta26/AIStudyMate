import React from 'react'
import {Link,Outlet} from 'react-router-dom'
import { useEffect,useState } from 'react'
import { MyContext } from './MyContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
const [fileSelected,setFileSelected]=useState(null)
const {LoggedInUsername,setLoggedInUsername,isLoggedIn,setIsLoggedIn,toggle,setToggle}=useContext(MyContext);
const navigate=useNavigate();
async function handleFileUpload(fileSelected){
  if(!fileSelected){
    console.log("No file Selected or upload");
    return;
  }

  try{
      const formData=new FormData();
      formData.append('file',fileSelected);
      formData.append('fileName',fileSelected.name);
      const res=await fetch('http://localhost:3000/fileUpload',{
        method:'POST',
        body:formData,
        credentials:'include'
      });
      const data=await res.json();
      if(data.sucess){
        fetchedData();
        console.log("File uploaded")
      }
  }
  catch(err){
    console.log(`Error in uploading ${err}`);
  }
}

function handleFileChange(e){

  if(isLoggedIn){
    console.log(isLoggedIn)
    try{
    const selectedFile=e.target.files[0];
    console.log("Selected file in backend when login",selectedFile.name)
    if(selectedFile){
    setFileSelected(selectedFile);
    console.log(`File selected is ${selectedFile.name} and path is ${e.target.files[0].path}`);

    handleFileUpload(selectedFile);

    }
    else{console.log('no file selected in handleFileChange')}
  }
  catch(err){
    console.log(`Error is : ${err}`);
  }
  
  }
  else{console.log("Login First");
    alert('Login First');
  }
}

useEffect(() => {
const timer=setTimeout(()=>{
  fetchedData();
},3000);
return ()=>clearTimeout(timer);
  // Always call it regardless of isLoggedIn; check login inside
}, [isLoggedIn]);

    const fetchedData = async () => {
    if (isLoggedIn) {
      try {
        const res = await fetch('http://localhost:3000/',{method:"GET", credentials:'include',});
        const data = await res.json();
        console.log("value in data is ",data)
        if (data) {
          console.log(`In home Data of fileName  is ${data.fileName}`);
          setUserdata(data);
          console.log(`Home -value in userData is ${userData}`);
        }
      } catch (err) {
        console.log("Nothing set in UserData");
        console.log(`Error is ${err}`);
      }
    } else {
      console.log('Please Log in To use Services');
    }
  };


function handleSummaryClick(){
  if(fileSelected){
    navigate('/Summary');
  }
  else{
    setFlashMsg('⚠️ Please select a file before proceeding!');
    setTimeout(() => setFlashMsg(''), 3000);
  }
}

function handleMcqClick(){
  if(fileSelected){
    navigate('/Mcq');
  }
  else{
    setFlashMsg('⚠️ Please select a file before proceeding!');
    setTimeout(() => setFlashMsg(''), 3000);
  }
}
async function deleteFile(){
  const res=await fetch('http://localhost:3000/delete',{ method:'GET', credentials:"include"});
  const data=await res.json();
  if(data.success){
    fetchedData();
    console.log("Refreshed");
  }
  else{console.log("No refresh is there");}
}

async function selectFileFromHistory(gotFileId){
  console.log("File Id in Frontend is ",gotFileId);
  const res= await fetch('http://localhost:3000/selectFile',{method:'POST',headers: {
      'Content-Type': 'application/json'
    },credentials:"include", body: JSON.stringify({ gotFileId })});
  const data=await res.json();
  if(data){
      console.log("Got Content from Backend is : ",data);
      console.log("Name of file got from backedn",data.message.fileName);
      const msg=data.message;
    setFileSelected(data.message);
    handleFileChange(data.message);
   console.log("Value in file  Selected in frontedn is",fileSelected);
  }


}

  const [userData,setUserdata]=useState(null);
  const [flashmsg,setFlashMsg]=useState('')
  return (
    <div className='w-full min-h-[calc(100vh-136px)] md:min-h-[calc(100vh-240px)] flex md:py-52'>
        <div className={toggle?' w-full bg-[#E9E3DF]':' w-full text-3xl bg-black'}>
            <div className={toggle?' w-full min-h-14 md:h-48 font-bold flex items-center justify-center flex-grow text-[rgb(36, 36, 36)] italics bg-[#DCD0A8]':'border-2 border-black w-full min-h-14 md:h-48 font-bold flex items-center justify-center flex-grow text-[rgb(36, 36, 36)] italics bg-[#393E46] text-[#FFCC00]'}>
              <h2 className='text-lg md:text-7xl  hover:cursor-pointer font-[gt-super, Georgia, Cambria, "Times New Roman", Times, serif] font-[400]  break-words '>Turn Your Notes into Smart Quizes with AI </h2>
          </div>
              <div className={toggle?' border-2 border-black w-full min-h-10 md:h-36 flex items-center justify-center text-[#8A784E] font-bold text-lg md:text-5xl' :'w-full min-h-10 md:h-36  flex items-center justify-center bg-black text-[#EB5B00] text-lg md:text-5xl font-bold'  }>
                <div className='flex items-center'><h2>{`Welcome ${LoggedInUsername}`}</h2></div>
              </div>
  
    <div className='flex justify-center items-center  h-2/3 md:h-2/3  flex-col'>
      <div className={toggle?'flex flex-wrap justify-between border-2 border-black h-3/4 md:h-4/5 w-3/4 bg-[#b6b09f] rounded-3xl':'flex flex-wrap border-2 border-black rounded-3xl h-3/4 md:h-4/5 w-3/4 bg-[#3C3D37] text-[#DFD0B8]'}>
               
          
  <div className="py-8 flex items-center justify-center w-1/2 md:w-1/2">

<div className='border-2 border-red-500 h-1/2 md:h-[30%] flex items-center flex-col justify-between '>
  <form method="POST" encType="multipart/form-data" className='flex items-center justify-center' >
    
      <label htmlFor="dropzone-file" className={toggle?"flex flex-col items-center justify-center w-4/5 md:w-full h-26 md:h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        :"flex flex-col items-center text-[#DFD0B8] justify-center w-4/5 md:w-full h-26 md:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#3c3d37] hover:bg-[#5c5e59] hover:text-[#DFD0B8]"}>
        <div className="flex flex-col items-center justify-center md:pt-5 md:pb-6 h-full md:min-h-full">
            <svg className={toggle? "w-8 md:w-20 h-4 md:h-20 mb-4 text-gray-500 dark:text-gray-400":"w-8 h-4 md:h-20 md:w-20 mb-4 text-gray-500 hover:text-[#DFD0B8]"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className={toggle? "mb-2 text-xs md:text-3xl text-gray-500 dark:text-gray-400" :"mb-2 text-xs md:text-3xl text-[#DFD0B8] "}><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className={toggle? "text-[0.5rem] text-gray-500 dark:text-gray-400 md:text-xl": "text-[0.5rem] md:text-xl text-[#DFD0B8]"}>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>

         
           <input id="dropzone-file" type="file" className="hidden" accept="application/pdf" name="pdf"
           onChange={(e)=>handleFileChange(e)}
           />
    </label>
</form>
<div className='border-2 border-yellow text-wrap  text-xs md:text-lg w-full flex items-center justify-center flex-wrap'>
  {fileSelected? <p className='text-sm md:text-xl'>{fileSelected.fileName}</p> : <p className='text-sm md:text-xl'>No file Selected</p>}
</div>
</div>

</div> 


              <div className='boder-2 border-black h-1/2  w-1/2 md:w-1/2'>
                <div className='border-2 border-black'>
                  <div className='flex items-center justify-center'>
                    <h2 className='text-sm md:text-4xl'>Your Notes</h2>
                  </div>
                  <div className='flex items-center justify-center w-full border-2 border-yellow-500'>

                    <table className="table-fixed w-full border-collapse border border-black">
  <thead className="bg-gray-200 text-xs md:text-4xl">
    <tr className='text-black'>
      <th className="w-1/3 border border-black px-2 py-1">File Name</th>
      <th className="w-1/3 border border-black px-2 py-1">Added On</th>
      <th className="w-1/3 border border-black px-2 py-1">Actions</th>
    </tr>
  </thead>
  <tbody>
    {isLoggedIn && userData && Array.isArray(userData) ? (
      userData.map((b, index) => (
        <tr key={index} className="text-[0.6rem] text-xs md:text-3xl text-center">
          <td className="border border-black px-1 md:px-4 py-1 break-words">
            {b.fileName}
          </td>
          <td className="border border-black px-1 md:px-4 py-1 break-words">
            {new Date(b.uploadedAt).toLocaleString()}
          </td>
          <td className="border border-black px-1 md:px-4 py-1">
        <div className='flex items-center justify-center'>
                      <div className='flex items-center justify-between w-2/3'>
              <button onClick={()=>selectFileFromHistory(b._id)}>✅</button>
              <button onClick={deleteFile}>❌</button>
            </div>
        </div>
          </td>
        </tr>
      ))
    ) : null}
  </tbody>
</table>

          
                  </div>
                </div>
              </div>
            </div>

      
      <div className='flex items-center justify-center  h-16 md:h-20 min-w-16 md:w-72'>
      {isLoggedIn?<div className='flex items-center justify-end flex-col border-2 border-blue-600'>
          <button className={toggle?"px-8  md:h-1/2 md:w-64 min-w-14 py-1 md:py-2  rounded-sm  md:rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-green-600 text-wrap text-sm md:text-4xl":"px-8 md:h-1/2 min-w-14 md:w-64 py-1  md:py-2 bg-[rgb(177,59,255)] rounded-sm md:rounded-md  text-white font-bold transition duration-200 hover:bg-[#a06bc4] text-wrap text-sm md:text-4xl"} onClick={fetchedData}>Reload</button>
        </div> : null}
      </div>
     

      </div>
        <div>
    {isLoggedIn?  
          <div className=' flex items-center justify-center w-full '>
                          <div className='flex items-center justify-between w-2/3'>
           <button onClick={handleSummaryClick} className={toggle?"px-8 h-1/2  w-24 md:w-64  py-2  rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-green-600 text-wrap text-sm md:text-4xl":"px-8 h-1/2 w-24 md:w-64  py-2 bg-[#B13BFF] rounded-md  text-white font-bold transition duration-200 hover:bg-[rgb(160,107,196)] text-wrap text-sm md:text-4xl"}>Summary</button>
            <button onClick={handleMcqClick} className={toggle?"px-8 h-1/2 w-24 md:w-64 py-2 rounded-md bg-green-500 text-white font-bold transition duration-200 hover:bg-green-600 text-wrap text-sm md:text-4xl":"px-8 h-1/2 w-24 md:w-64 py-2 bg-[#B13BFF] rounded-md  text-white font-bold text-sm md:text-4xl transition duration-200 hover:bg-[#a06bc4] text-wrap"}>Mcq</button>
          </div>
          </div>
    : <div className='w-full h-[50px] md:h-[200px] flex items-center justify-center'>
      <div className='w-1/2 h-1/2 md:h-1/2'>
        <span className={toggle? 'flex items-center justify-center animate-pulse text-bold bg-[#FF7A30] text-xs md:text-3xl font-bold text-wrap flex-wrap md:h-full':'text-[#EBD3F8] flex items-center justify-center animate-pulse bg-[#AD49E1] font-bold text-wrap flex-wrap text-xs md:text-3xl md:h-full'}>Please Login First</span>
      </div> 
      
    </div>
    }
        </div>
        <div  >
          {flashmsg && (
        <div className="bg-red-500 text-white sm:text-lg md:text-2xl px-4 py-2 rounded mt-8 flex items-center justify-center font-bold">
          <p>{flashmsg}</p>
        </div>
      )} 
        </div>

        </div>
          <Outlet/>
    </div>
  )

}

export default Home;
