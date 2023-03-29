const User = require("./models/userModel")
const bcrypt = require("bcryptjs")
const localStrategy = require("passport-local").Strategy


// https://github.com/woodburydev/passport-local-video/blob/master/backend/server.js 
// code annotated from Woodbury 
module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) throw err
        if (!user) return done(null, false)
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err
          if (result === true) {
            return done(null, user)
          } else {
            return done(null, false)
          }
        })
      })
    })
  )

  passport.serializeUser((user, done) => {
    console.log('User serialization', user.id)
    done(null, user.id)
  })

  passport.deserializeUser((id, cb) => {
    console.log("Is this being run?")
    User.findOne({ _id: id }, (err, user) => {
      if(err) throw err
      const userInformation = {
        username: user.username,
      }
      cb(err, userInformation)
    })
  })
}