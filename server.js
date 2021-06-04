if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}
const methodOverride = require('method-override')
const bodyParser = require("body-parser");
const express=require("express");
const app=express();
var path=require("path");
const bcrypt=require('bcryptjs');
const database = require("mime-db");
const flash=require('express-flash');
const session=require('express-session');
const passport=require('passport');
const initializePassport=require('./passport-config')
initializePassport(
    passport,
    email=>users.find(user=> user.email===email),
    id=>users.find(user=>user.id===id)
    
    )
    const users=[];
const port=process.env.PORT||3000//if that port is available use it or else use the 3000 port
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')))

app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session(
    {
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false
    }
))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.get('/',checkNotAuthenticated,(req,res)=>{
    res.render('index');
})
app.get('/HomePage',checkAuthenticated,(req,res)=>{
    res.render('afterlogin',{name:req.user.name})
})
app.get('/register',checkNotAuthenticated,(req,res)=>{

   

    res.render('register');

})
app.post('/register',checkNotAuthenticated,async(req,res)=>{

    try{
        const hashedPassword= await bcrypt.hash(req.body.password,10)
        users.push({
            id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword
        })
        res.redirect('/')
    }catch{
res.redirect('/register')
    }
   

})

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
  })
  

app.post('/',checkNotAuthenticated,passport.authenticate('local',{
    successRedirect:'/HomePage',
    failureRedirect:'/',
    failureFlash:true
}))
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/HomePage')
    }
    next()
  }
  
app.listen(port,()=>{
    console.log(`Listening on port ${port} `);
});//This means server will only listen

