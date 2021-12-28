const express=require('express')
const bodyParser = require('body-parser')
const ejs =require('ejs')
const querystring = require('querystring');
const Service = require("./modules/service.js")
const multipart = require('connect-multiparty')
const session = require('express-session')
const sd = require('silly-datetime');

const app=express()

app.set('view engine', 'ejs')
app.use(express.static('node_modules'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const multipartyMiddleware = multipart()

app.use(session({
    secret: 'this is a session', //服务器生成session签名
    name: 'username',
    resave: false, //强制保存session即使他没有变化
    saveUninitialized: true, //强制保存未初始化的session
    cookie: {
        maxAge: 1000 * 60 * 30   // 过期时间
    },
    rolling: true
}))



app.get('/',(req,res)=>{
    res.render('s_index.ejs',{info:null})
})

app.get('/s_index',(req,res)=>{
    if(req.session.user==null) res.render('s_index.ejs',{info:null})
    else res.render('s_index.ejs',{info:req.session.user.username})
})

app.get('/t_index',(req,res)=>{
    if(req.session.user==null) res.render('t_index.ejs',{info:null})
    else res.render('t_index.ejs',{info:req.session.user.username})
})

//学生登陆
app.get('/s_login',(err,res)=>{
    res.render('s_login.ejs',{info:null})
})

//教师登陆
app.get('/t_login',(err,res)=>{
    res.render('t_login.ejs',{info:null})
})


//学生注册
app.get('/s_reg',(err,res)=>{      
    res.render('s_reg.ejs',{info:null})
})

//教师注册
app.get('/t_reg',(err,res)=>{      
    res.render('t_reg.ejs',{info:null})
})

//学生登陆
app.post('/s_doLogin',(req,res)=>{
    var number = req.body.number
    var password = req.body.password
    Service.User.findOne({"number": number, "password": password}).exec((err, user) => {
      //  console.log(user)
        if(err) return console.log(err)
        if(!user) res.render("s_login.ejs", {info: "账号或密码错误"})
        else{
            //req.session.user = user
            req.session.username=user.username
            req.session.number=user.number
            req.session.sex=user.sex
            req.session.class_=user.class_
            req.session.major=user.major
            req.session.phone=user.phone
            req.session.number=user.number
            
            res.render("s_index.ejs", {info: user.username})
        }
    })

})

//教师登陆
app.post('/t_doLogin',(req,res)=>{
    var number = req.body.number
    var password = req.body.password
    Service.User.findOne({"number": number, "password": password}).exec((err, user) => {
      //  console.log(user)
        if(err) return console.log(err)
        if(!user) res.render("s_login.ejs", {info: "账号或密码错误"})
        else{
            //req.session.user = user
            req.session.username=user.username
            req.session.number=user.number
            req.session.sex=user.sex
            req.session.class_=user.class_
            req.session.major=user.major
            req.session.phone=user.phone
            req.session.number=user.number
            
            res.render("t_index.ejs", {info: user.username})
        }
    })

})


//学生注册
app.post('/s_doReg',multipartyMiddleware,(req,res)=>{
    var password=req.body.password
    var username=req.body.username
    var number=req.body.number
    var sex=req.body.sex
    var major = req.body.major
    var class_=req.body.class_
    var phone=req.body.phone
    var identity="1"
    Service.User.find({"number": number}, (err, user) => {
        if(user.length == 0) {
            Service.InsertUser(username,password,number,major,class_,sex,phone,identity)
            res.render("s_login.ejs", {info: "注册成功！"})
        }
        else{
            res.render("s_reg.ejs", {info: "该学号已注册！"})
        }
    })


})

//教师注册
app.post('/t_doReg',multipartyMiddleware,(req,res)=>{
    var password=req.body.password
    var username=req.body.username
    var number=req.body.number
    var sex=req.body.sex
    var major = req.body.major
    var class_=0
    var phone=req.body.phone
    var identity="2"
    Service.User.find({"number": number}, (err, user) => {
        if(user.length == 0) {
            Service.InsertUser(username,password,number,major,class_,sex,phone,identity)
            res.render("t_login.ejs", {info: "注册成功！"})
        }
        else{
            res.render("t_reg.ejs", {info: "该学号已注册！"})
        }
    })


})
//退出
app.get('/logOut', (req, res) => { 
    req.session.user=null
    res.render("s_login.ejs", {info: null})
})

//学生提交请假申请
app.get('/s_apply', (req, res) => { 
    res.render("s_apply.ejs", {info: req.session.username})
})

//学生提交请假申请
app.post('/doApply',multipartyMiddleware, (req, res) => { 
    var number=req.session.number
    var start_time_=req.body.start_time
    var state="申请请假"
    var reason=req.body.reason
    var teacher = ""
    var end_time=req.body.end_time
    Service.InsertLeave(number,start_time_, state, reason,teacher,end_time)
    res.render("s_index.ejs", {info: req.session.username})
})

//学生撤销申请
app.get('/s_delet', (req, res) => { 
    console.log(req.query._id)
    Service.Leave.deleteOne({ "_id": req.query._id}, function (err) { 
        if (err) { 
            console.log(err); 
            return; 
        }
        console.log('成功'); });

        Service.Leave.find({"number":req.session.number},(err, leave) => {
            if(err)
            {
                console.log(err);
                return ;
            }
            
            for(var i=0;i<leave.length;i++){
                leave[i].username=req.session.username
                leave[i].sex=req.session.sex
                leave[i].major=req.session.major
                leave[i].phone=req.session.phone
                leave[i].class_=req.session.class_
            }
            
            //console.log(list)
                res.render("s_leave.ejs", {info: req.session.username,
                                            list:leave})
        })
})


//学生查询自己的请假记录
app.get('/s_leave', (req, res) => { 
    //console.log(req.session.number)
    Service.Leave.find({"number":req.session.number},(err, leave) => {
        if(err)
        {
            console.log(err);
            return ;
        }
        
        for(var i=0;i<leave.length;i++){
            leave[i].username=req.session.username
            leave[i].sex=req.session.sex
            leave[i].major=req.session.major
            leave[i].phone=req.session.phone
            leave[i].class_=req.session.class_
        }
        
        //console.log(list)
            res.render("s_leave.ejs", {info: req.session.username,
                                        list:leave})
    })
    
})

//学生查询教师信息
app.get('/s_doTea', (req, res) => { 
    Service.User.find({"number":req.query.t_num},(err, user) => {
        if(err)
        {
            console.log(err);
            return ;
        }
        
        
      // console.log(user)
        res.render("s_tea.ejs", {info: req.session.username,
        tt:user})
    })
    
})






app.listen(3000)

