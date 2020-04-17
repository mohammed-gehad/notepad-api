const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('config')
require('./models/UserModel')
const userRoute = require('./Router/UserRoute')

//database connection
const mongoURI = `mongodb+srv://mohammed:${config.get('MongoPassword')}@cluster0-mpwkt.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(mongoURI,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true})
.then(console.log('connected to DB'))
.catch((e)=>console.log(e))
//database connection


app.use('/user',userRoute)
const port = process.env.PORT || 4000
app.listen(port,()=>console.log('listening at ',port))