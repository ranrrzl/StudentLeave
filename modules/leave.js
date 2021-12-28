const mongoose=require('./db.js')

const LeaveSchema={
    username:String,
    sex:String,
    major:String,
    phone:String,
    class_:String,
    number:String,
    end_time:String,
    start_time:String,
    state:String,
    reason:String,
    teacher:String
}

const Leave = mongoose.model("Leave",LeaveSchema,'leave')
module.exports=Leave