const express = require("express")
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "iLoveCoding"
const cors = require("cors");

app.use(express.json());
app.use(cors());

let users = [];

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
   username,
   password
  })

  res.json({
    message: "You signed up on the app"
  })
})

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find(u => u.username === username && u.password === password)

  if(user){
    const token = jwt.sign({
      username: username
    },JWT_SECRET)
    res.json({
      token: token
    })
  }
  else{
    res.status(404).json({
      message: "you credentials are inncorrect"
    })
  }
})

function auth(req, res, next){
  const token = req.headers.token;
  const user = jwt.verify(token, JWT_SECRET);
  if(user){
    req.user = user;
    next()
  }
  else{
    res.json({
      message: "Unauthorized"
    })
  }
}

app.get("/me", auth, function (req, res) {
  const user = req.user;

  const foundUser = users.find(u => u.username === user.username)
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
  console.log("app is listening on port:",port)
})