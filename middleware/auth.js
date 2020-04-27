 const jwt = require('jsonwebtoken')
const config = require('config')

 module.exports = function(req,res,next){
    const token = req.header('token')
    const decoded = jwt.decode(token,process.env.jwtSecret)
    if(!decoded)res.send('invalid token')
    else{
        req.user = decoded
        next()
    }
 }