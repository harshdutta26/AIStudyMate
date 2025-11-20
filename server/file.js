const mongoose=require('mongoose');
require('dotenv').config()
console.log("DEBUG: Render MONGO_URL now : ", process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.log(`Value of mongo url${process.env.MONGO_URL}`)
  console.error('❌ MongoDB connection error:', err)});

// mongoose.connect('mongodb://localhost:27017/fileData');
const documentSchema=mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId,
    fileName:String,
    content:String,
    uploadedAt: { type: Date, default: Date.now }

});
module.exports=mongoose.model('Document',documentSchema);
