 const jwt = require('jsonwebtoken')
const config = require('config')

 module.exports = function(req,res,next){
    const token = req.header('x-token')
    const decoded = jwt.decode(token,config.get('jwtSecret'))
    if(!decoded)res.send('invalid token')
    else{
        req.user = decoded
        next()
    }
 }