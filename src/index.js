import express from "express"
import dotenv from "dotenv"
import {connection} from "./db/connect.js"
import cors from 'cors'
import morgan from 'morgan'
import authRouter from "./routs/authRouter.js";
import courseRouter from "./routs/coursesRouter.js"
import userCourseRouter from "./routs/userCoursesRout.js"
import videoRouter from "./routs/videoRouter.js"

//config
dotenv.config()
const app=express() 

//middleware
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  })
)
 
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

app.use(cors({
    origin:'*'
}))
  
//routers
app.use('/auth',authRouter);
app.use('/course',courseRouter);
app.use('/usercourse',userCourseRouter);
app.use('/video',videoRouter);
 
//init
app.get('/',(req, res)=> {
  res.send("hello from EdTech platform");
})


//server start
const server = async () => {
    try {
      process.stdout.write(`\x1b[2J`); //clear screen 
      process.stdout.write(`\x1b[0f`); //set cursor to 0,0
      console.warn("\x1b[30m ▶️ Starting App :");
      await connection().then(()=>{
        app.listen(process.env.port || 8080, () => {
          console.log(`\x1b[32m  🚀 http://localhost:${process.env.port || 8080}/\x1b[0m`);
        });
      });
    } catch (error) {
      console.log("server: " + error);
    }
  };
  

  server();
  export default app