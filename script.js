const express = require("express");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ILoveCoding"
const cors = require("cors");

app.use(cors());

app.use(express.json());


const users = [];

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  
  users.push({
    username,
    password
  })
  res.json({
    message: "user signed up successfully"
  })
})

app.post("/signin", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(u => u.username === username && u.password === password)

  if(user){
    const token = jwt.sign({
      username: user.username
    },JWT_SECRET)
    res.json({
      token: token
    })
  }
  else{
    res.json({
      message: "Credentials are inncorrect"
    })
  }
})

function auth(req, res, next){
  const token = req.headers.token;
  const decodedUser = jwt.verify(token, JWT_SECRET);

  if(decodedUser){
    req.user = decodedUser;
    next();
  }
  else{
    res.json({
      message: "Authentication failed"
    })
  }
} 

app.get("/me",auth, function (req, res) {
  const user = req.user;

  const foundUser = users.find(u => user.username === u.username)
  if(foundUser){
    res.json({
      username: foundUser.username,
      password: foundUser.password
    })
  }
  else{
    res.json({
      message: "user does not exists"
    })
  }
})  

app.listen(port, () => {
  console.log("app is listening on port:", port);
})