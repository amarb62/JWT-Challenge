const path = require('path');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const SecretKey = "SecretCodeForToken";
const issuer = "google";
var displayName = " ";

app.use(express.static(path.join(__dirname, 'public')));

//Root client Page
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/public/clientPage.html'));
})

app.get('/welcome',validate,(req,res)=>{
    res.send("Hi "+displayName);
})

//Middleware function to verify jwt token and the issuer
function validate(req,res,next){
    try{
        const accessToken = req.query.token;
        
        let payload = jwt.verify(accessToken, SecretKey);
        if(payload.issuer == issuer){
            displayName = payload.username;
            next();
        }
        else
            res.status(401).send("Unauthorised User");
        
    }
    catch(err){
        res.status(401).send("Unauthorised User");
    }
}

app.listen(5000,()=>{
    console.log("Server lisening on port 5000");
})
