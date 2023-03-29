const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]
})

const User = mongoose.model("User", userSchema)

module.exports = User