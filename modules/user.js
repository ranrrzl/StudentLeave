const mongoose=require('./db.js')

const UserSchema={
    username:String,
    password:String,
    number:String,
    major:String,
    class_:String,
    sex:String,
    phone:String,
    identity:String,
}
const User = mongoose.model("User",UserSchema,'user')
module.exports=User