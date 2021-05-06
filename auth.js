const path = require('path');
const express = require('express');
const auth = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

//Storing Hardcoded User details
const user={
    username: "amarb", 
    password:"$2b$10$F0x1c1WlHcTjbPggNRa4W./MNXFWXZzGNmGZ9TO32iSuh/XJYcp6e",
    name: "Amar Barik"
}

const SecretKey = "SecretCodeForToken";
const clientID = 'robomart';
var redirectURL = 'http://localhost:5000/welcome';

auth.use(express.static(path.join(__dirname, 'public')));
auth.use(bodyParser.urlencoded({extended: true}))

auth.get('/login',authenticate,(req,res)=>{
    res.sendFile(path.join(__dirname+'/public/authPage.html'));
})

auth.post('/login',async(req,res)=>{
    try{
        try{
            const uname = req.body.uname;
            const pwd = req.body.pwd;

            //Payload for jwt token 
            var payload = {issuer: "google", username: uname};

            //Checking if the username entered by user is registered in database or not
            if((user.username == uname) == false){
                res.send("Invalid user");
            }

            //Matching the entered password with the stored hashed password in database
            const passwordMatch = await bcrypt.compare(pwd, user.password);

            if(passwordMatch){
                //JWT signing of token
                var token = jwt.sign(payload, SecretKey, {expiresIn: '300s'});

                //Passing token as query parameter
                redirectURL = redirectURL+"?token="+token;
                res.redirect(redirectURL);
            }
            else{
                res.send("Invalid user");
            }
    
        }catch(error){
            res.status(400).send("Problem");
        }
    }
    catch(e){
        res.send(e);
    }
})

//Middleware function to check the authentication of source 
function authenticate(req,res,next){
    if((req.query.client_id == clientID && req.query.redirect_url == redirectURL) == false){
        res.send("Unauthorised User");
    }
    next();
}

auth.listen(5001,()=>{
    console.log("Server lisening on port 5001")
})