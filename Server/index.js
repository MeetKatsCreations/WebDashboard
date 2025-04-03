const express=require("express")
const cors=require("cors")
const cookieParser = require("cookie-parser")
const session = require('express-session');
const passport = require("./Middleware/PassPort");
const app=express();
require("./Config/Config")
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,                
}));
app.use(session({
    secret: "9527351144674ansh@11234",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
const port=process.env.PORT||3000
app.use("/",require("./Routes/AuthenticationRoutes"))
app.use("/event",require("./Routes/EventRoutes"))
app.use("/profile",require("./Routes/ProfileRoutes"))
app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})
