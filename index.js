// const ngrok = require('ngrok')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('config')
require('./models/UserModel')
require('./models/NotesModel')
const userRoute = require('./Router/UserRoute')
const NoteRoute = require('./Router/NoteRoute')



//database connection
const mongoURI = `mongodb+srv://mohammed:${config.get('MongoPassword')}@cluster0-mpwkt.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(mongoURI,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true , useFindAndModify: false })
.then(console.log('connected to DB'))
.catch((e)=>console.log(e))
//


app.use('/user',userRoute)
app.use('/note',NoteRoute)

const port = process.env.PORT || 3000
app.listen(port,()=>console.log('listening at ',port))


// const ngrokConnect = async () =>{
//   const url = await ngrok.connect(port);
//   console.log(url)
// }
// ngrokConnect()


