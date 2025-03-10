const express=require("express")
const cors=require("cors")
const cookieParser = require("cookie-parser")
const app=express();
require("./Config/Config")
app.use(express.json())
app.use(cookieParser())
const port=process.env.PORT||3000
app.use("/",require("./Routes/AuthenticationRoutes"))
app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})
