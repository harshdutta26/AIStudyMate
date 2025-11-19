const jwt=require('jsonwebtoken')
require('dotenv').config()
function verifyToken(req,res,next){

    const token=req.cookies.token;
        console.log('All cookies :' ,req.cookies);
    console.log('Token cookie :', token);
    if(!token){
        console.log('No token found')
        return res.status(401).json({success:false,message:"No Token Found. Acess Denied"});
    }
    try{
        console.log(`Value of secret key :${process.env.SECRET_KEY}`)
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        req.user=decoded;
        next();
    }
    catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}
module.exports=verifyToken;