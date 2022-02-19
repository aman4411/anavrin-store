const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        maxlength:[30,'Name cannot exceed 30 characters'],
        minlength:[2,'Name cannot have less than 2 characters']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:[true,'Email already exists'],
        validate:[validator.isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minlength:[6,'Password cannot have less than 6 characters'],
        select:false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    resetPassword:String,
    resetPasswordExpire:Date
});

//hash password before saving in db
userSchema.pre("save",async function(next){
    //not to hash in case of update profile condition
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

module.exports = mongoose.model("User",userSchema);