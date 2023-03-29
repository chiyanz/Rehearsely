const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const router = require('./routing/router')
const passport = require("passport")
const passportLocal = require("passport-local").Strategy
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const cookieSession = require("cookie-session")
const bodyParser = require("body-parser")

require("dotenv").config() 
// declare paths that need authentication to access

const app = express()
const connection_string = process.env.CONNECTION_STRING

// <--------------------Connect to MongoDB---------------------->
mongoose.connect(connection_string)
  .then(console.log("MongoDB connected"))
  .catch(err => console.log(err))

// <-------------------Start of middleware---------------------->
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  next()
})
app.use(
  cors({
    origin: "https://final-project-chiyanz.vercel.app", // <-- location of the react app were connecting to (http://localhost:3000 or https://final-project-chiyanz.vercel.app)
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser("secretcode"))
app.use( session({
    proxy : true,
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
)

app.use(passport.initialize())
app.use(passport.session())
require("./passportConfig")(passport)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log("Request Method : ", req.method)
  console.log("Request Path : ", req.path)
  console.log("Request Body : ", JSON.parse(JSON.stringify(req.body)))
  console.log('Current User: ', req.user)
  next()
})


// ------------------------------------ Router ------------------------------
app.use("/", router)

app.listen(process.env.PORT || 3001, () => {
  // perform a database connection when server starts
  console.log(`Server is running on port 3001`)
})



module.exports = app