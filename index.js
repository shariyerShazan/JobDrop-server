import dotenv from "dotenv"
dotenv.config()
import express from "express"
const app = express()
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./utils/db.js"
import userRoutes from "./routes/user.route.js"
import jobRoutes from "./routes/job.route.js"
import applicationRoutes from "./routes/application.route.js"
 

// middlewares
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
  }))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// all api
app.get("/" , (req , res)=>{
    res.status(200).json({
        message: "server home page running",
        success: true
    })
}) 
app.use("/api/users" , userRoutes)
app.use("/api/jobs" , jobRoutes)
app.use("/api/applications" , applicationRoutes)


// server
const PORT = process.env.PORT || 4008

const runServer = async (req, res)=>{
    await connectDB()
    app.listen(PORT , ()=>{
        console.log(`Your server is running at http://localhost:${PORT}`)
    })
}
runServer()