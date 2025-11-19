const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    username:String,
    emailId:String,
    hashPassword:String,
    // fileName:String,
    // data:Buffer,
    // contentType:String

});
module.exports=mongoose.model('user',userSchema);