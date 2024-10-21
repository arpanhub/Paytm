require('dotenv').config();
const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;


mongoose.connect(dbURI, {
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,  
    tls: true  
})
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

const userSchema = mongoose.Schema({
  username: {
    type:String,
    required:true,unique:true
  },
  password: String,
  firstname: String,
  lastname: String,
});

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
