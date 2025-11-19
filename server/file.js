const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/fileData');
const documentSchema=mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId,
    fileName:String,
    content:String,
    uploadedAt: { type: Date, default: Date.now }

});
module.exports=mongoose.model('Document',documentSchema);
