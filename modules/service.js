const User = require('./user')


const Leave = require('./leave')
//向用户表中插入数据


function InsertUser(username,password,number,major,class_,sex,phone,identity) {
    var user=new User({
        username:username,
        password:password,
        number:number,
        major:major,
        class_:class_,
        sex:sex,
        phone:phone,
        identity:identity

    })
    user.save((err)=>{
        if(err) return console.log(err)
        console.log("插入user成功")
    })
    
}

//向请假表中插入数据
function InsertLeave(number,start_time, state, reason,teacher,end_time,sex,major,phone,username,class_) {
    var leave=new Leave({
        number:number,
        start_time:start_time,
        state:state,
        reason:reason,
        teacher:teacher,
        end_time:end_time,
        sex:sex,
        major:major,
        phone:phone,
        username:username,
        class_:class_

    })
    leave.save((err)=>{
        if(err) return console.log(err)
        console.log("插入leave成功")
    })
    
}


module.exports={User,Leave,InsertUser,InsertLeave}