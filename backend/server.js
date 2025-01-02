const express=require('express')
const mongoose=require('mongoose')
const dotenv = require('dotenv');
const router = require('./Router/campRouter')
var cors = require('cors')
const srouter = require('./Router/adminroutes')


dotenv.config();

const uri=process.env.MONGO_URI
const port=process.env.port
console.log(uri)
console.log(port)
const app=express()
app.use(express.json())
app.use(cors())

app.use('/api',router)
app.use('/api2',srouter)

const connectDb=async()=>{
    try{
 const data= await mongoose.connect(uri)
 console.log('conneted to database')
    } catch(err){
        console.log(err)
    }
}
app.listen(port,()=>{
    connectDb()
    console.log('server is connected')
})