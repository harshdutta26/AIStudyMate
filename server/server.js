const express=require('express')
const multer=require('multer')
const upload=multer({dest:'uploads/'});
require('dotenv').config();
const fs=require('fs');
const pdf=require('pdf-parse');
const bcrypt=require('bcrypt')
const {GoogleGenAI, UpscaleImageResponse}=require('@google/genai')
const {GridFsStorage}=require('multer-gridfs-storage')
const path=require('path')
const userModel=require('./user')
const fileModel=require('./file')
const cors=require('cors');
const app=express()
const session=require('express-session');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const verifyToken=require('./middleware/verifyToken')
const flash=require('connect-flash')


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({origin:'http://localhost:5173',
  credentials: true}));
app.use(cookieParser())
app.use((req,res,next)=>{
    console.log("Cookies recieved n route",req.path);
    console.log("req.cookies",req.cookies);
    next();
})
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:"any"
}));
app.use(flash());

app.get('/',async(req,res)=>{
    const myUserId=req.session.userId
    console.log(`UserId is ${myUserId}`);
    if(myUserId){
        const uploadedFiles = await fileModel.find({userId:myUserId});
         console.log("find uploaded files");
         console.log(`Value in uploaded files before sending is ${uploadedFiles}`);
    res.json(uploadedFiles);
   
    }
    else{res.status(404).json({message:"Not found"}); }
});

app.get('/delete',async(req,res)=>{
    const myUserId=req.session.userId;
    const data=await fileModel.deleteOne({userId:myUserId});

    res.status(201).json({success:"true",message:"Deleted Successfully"});
})

app.get('/Mcq',verifyToken,async(req,res)=>{
        const api_Key=process.env.GEMINI_API_KEY;
        const selectedFileId=req.session.selectedFileId;
    if (!api_Key) {
            console.error("Error: GEMINI_API_KEY not found in environment variables. Please check your .env file.");
            return res.status(500).json({ success: false, message: "Server configuration error: Gemini API key missing." });
        }
    const ai=new GoogleGenAI({apikey:api_Key});
            const userId=req.session.userId;
    const userSelectedtFile=await fileModel.findOne({_id:selectedFileId});
        if (!userSelectedtFile || !userSelectedtFile.content) {
      return res.status(404).json({ success: false, message: "No uploaded file found for this user" });
    }
    // const val=req.session.pdfText?.text || "";
    console.log(`Content is ${userSelectedtFile.content}`)
    const prompt=`Make 10 mcqs of it  ${userSelectedtFile.content}`
   
    async function main(){
        const ans=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:prompt,
            config: {
      thinkingConfig: {
        thinkingBudget: 0, 
      },
    }
        });
        
        if(ans){
            console.log(ans.text);
            res.status(201).json({success:true,message:"Done",mcq:ans.text});
        }
        else{console.log("Not found");}
    }
    main();
})

app.get('/Summary',verifyToken,async (req,res)=>{
    const api_Key=process.env.GEMINI_API_KEY;
    const selectedFileId=req.session.selectedFileId;
    if (!api_Key) {
            console.error("Error: GEMINI_API_KEY not found in environment variables. Please check your .env file.");
            return res.status(500).json({ success: false, message: "Server configuration error: Gemini API key missing." });
        }
        
    
    const ai=new GoogleGenAI({apikey:api_Key});
    const userId=req.session.userId;
    const userSelectedtFile=await fileModel.findOne({_id:selectedFileId});
        if (!userSelectedtFile || !userSelectedtFile.content) {
      return res.status(404).json({ success: false, message: "No uploaded file found for this user" });
    }
    // const val=req.session.pdfText?.text || "";
    console.log(`Content is ${userSelectedtFile.content}`)
    const prompt=`Summarize this ${userSelectedtFile.content}`
   
    async function main(){
        const ans=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:prompt,
            config: {
      thinkingConfig: {
        thinkingBudget: 0, 
      },
    }
        });
        
        if(ans){
            console.log(ans.text);
            res.status(201).json({success:true,message:"Done",summary:ans.text});
        }
        else{console.log("Not found");}
    }
    main();
    
});
app.get('/Logout',(req,res)=>{
    console.log('Logout in backend');
res.json({success:true,message:"logout Done"});
});
app.get('/foundFile',async(req,res)=>{
            const recievedFileName=req.body.fileName;
        console.log("File Name got in Backend is ",recievedFileName);
    try{
    const gotFile=await fileModel.findOne({fileName:recievedFileName});
    console.log("File Object Got in Backend is ",gotFile);
    console.log("Content of that obj is ",gotFile.content);
    console.log("File Name in backend recieved is ",recievedFileName);
    res.status(201).send(gotFile);
    }
    catch(err){res.status(404).json({success:false,message:"File Not Found"});}
    
});
app.post('/selectFile', async(req,res)=>{     
 if (!req.session.userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const fileId=req.body.gotFileId;
    console.log("File Id got in Backend is ",fileId);
    const file=await fileModel.findOne({_id:fileId,userId:req.session.userId});
    if(!file){
        return res.status(404).json({success:false,message:"File not found"});
    }
    req.session.selectedFileId=fileId;
    // console.log("File Name in Backend is ",fileName);
    console.log("File Name in Backend 2nd is ",file.fileName);
    
    res.status(201).json({success:true,message:file});
})

app.post('/fileUpload',upload.single('file'),verifyToken,async(req,res)=>{    const file=req.file;
    console.log(`File Recieved and name is ${file.path}`)
    const dataBuffer=fs.readFileSync(file.path);
     const data= await pdf(dataBuffer);
    req.session.pdfText=data.text;

    const file_data=await new fileModel({
        userId:req.session.userId,
        fileName:req.file.originalname,
        content:data.text
    });
    await file_data.save();

     res.status(201).json({success:'true',message:"File Uploaded in Backend sucessfuly"});

});

app.post('/SignUp',async (req,res)=>{
    
    const {username,emailId,hashPassword}=req.body;
    if(!username||!emailId){
        return res.status(401).json({success:false,message:"Please enter username ,emailId, Password"})
    }
    console.log(`hashpass is : ${hashPassword} email is ${emailId} and username is ${username}`)
    if(hashPassword.length<6){
        return res.status(400).json({success:false,message:"Password length should be at least 6 characters long"})
    }
    try{

        const existingUser=await userModel.findOne({emailId:emailId});

        if(existingUser){
            return res.status(409).json({success:false,message:"EmailId already registered"});
        }
    const saltrounds=10;
   
    const token=jwt.sign({"token":emailId},process.env.SECRET_KEY);
        
    const hashpass=await bcrypt.hash(hashPassword,saltrounds);

    const user=await new userModel({
        username,emailId,hashPassword:hashpass
    });

    await user.save();


    console.log("User Registered successfuly : ",user.username);
    res.cookie('token',token,{
  httpOnly: true,
  sameSite: 'Lax',
  secure: false});
    console.log(`Token value is ${token}`)
    res.status(201).json({success:true,message:"User Registered sucessfuly",
        username:user.username,
        emailId:user.emailId
}
    );

    }
    catch(err){
        console.log('Error during Regitring');
        if(err.code===11000){
            return res.status(409).json({success:false,message:"username exists"})
        }
         res.status(500).json({ success: false, message: "Internal server error during registration.", err: err.message });
    }
});

app.get('/Setflash',(req,res)=>{
     req.flash('message','Success user found!');
     res.redirect('/flash');
});
app.get('/flash',(req,res)=>{
    const msg=req.flash('message');
    res.send(msg);
})

app.post('/Login', async (req, res) => {
    const { emailId, hashPassword } = req.body;
    const token=jwt.sign({"token":emailId},process.env.SECRET_KEY);
    if (!emailId || !hashPassword) {
        return res.status(400).json({ success: false, message: "Email and password required" });
    }

    try {
        const oldUser = await userModel.findOne({ emailId });

        if (!oldUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log(`Old user found: ${emailId}`);
        const isMatch = await bcrypt.compare(hashPassword, oldUser.hashPassword);

        if (isMatch) {
            req.session.userId=oldUser._id;
            console.log(`Welcome: ${emailId}`);
            req.flash('message','Success user found!');
           res.cookie('token',token,{
  httpOnly: true,
  sameSite: 'Lax',
  secure: false});
           
                  return  res.status(200).json({ success: true, message: "Login successful",username:oldUser.username})
            

        } else {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
});

app.listen(3000,()=>{
    console.log('Listening')
});