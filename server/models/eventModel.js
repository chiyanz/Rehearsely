const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  dates: [Date],
  attendees: [{
    username: String,
    response: [Boolean] 
  }],
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event