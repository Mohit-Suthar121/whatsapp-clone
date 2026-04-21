import './config/dotEnvConfig.js'
import express from 'express';
import authRoute from './routes/authRoute.js'
import { chatRouter } from './routes/chatRoute.js'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { connectDb } from './config/connectDb.js'
import { initializeSocket } from './services/SocketService.js';
import http from 'http';
import cors from 'cors'
import { statusRouter } from './routes/statusRoute.js';
import { cleanUpUnverifedUsersJob } from './utils/cleanUpUnverifiedUsers.js';
const app = express()
const port = 3000
const server = http.createServer(app)

// const corsOptions = {
//   origin: process.env.FRONTEND_URL,
//   credentials: true                                                                                                                                                               
// }                                    
// app.use(cors(corsOptions))


const allowedOrigins = [
  "http://localhost:5173",
  "https://whatsapp-clone-rouge-eight.vercel.app"
]

app.use(cors({
  origin: function (origin,callback){
    if(!origin){
      return callback(null,true);
    }

    if(allowedOrigins.includes(origin)){
      return callback(null,true)
    }

    else {
      return callback(new Error("Not allowed by CORS"))
    }

  },
  credentials:true
}))

const io = initializeSocket(server)

app.use((req,res,next)=>{
  req.io = io;
  req.socketUserMap = io.socketUserMap
  next();
})

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/auth', authRoute)
app.use('/api/chat', chatRouter)
app.use('/api/status',statusRouter)


app.get('/', (req, res) => {
  res.send('This is the homePage!')
})





connectDb().then(() => {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})

cleanUpUnverifedUsersJob();

