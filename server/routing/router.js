const express = require("express");
const Event = require("../models/eventModel.js");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;

const router = express.Router();

router.post("/invitations", (req, res) => {
  const newEvent = new Event({
    title: req.body.event.title,
    description: req.body.event.description,
    dates: req.body.event.dates,
    attendees: req.body.event.attendees,
  });

  newEvent.save().then((savedEvent) => {
    User.findOne({ _id: req.body.user._id }, (err, doc) => {
      if (err) throw err;
      if (doc) {
        doc.events = [...doc.events, savedEvent._id];
        doc.save();
      }
    });
  });
});

router.post("/schedules", (req, res) => {
  console.log("User info sent via body", req.body);
  console.log("current user", req.user);
  User.findOne({ _id: req.body._id })
    .populate("events")
    .exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("User info: ", doc.events);
        res.json(doc.events);
      }
    });
});

router.post("/myinvites", (req, res, next) => {
  console.log("checking for username passed to route: ", req.body.username);
  // {$or: [{attendees: {username: req.body.username, response: true}}, {attendees: {username: req.body.username, response: false}}]}
  Event.find({}, (err, doc) => {
    if (doc) {
      console.log("All events", doc);
      res.json(
        doc.filter((event) => {
          return event.attendees.some(
            (attendee) => attendee.username == req.body.username
          );
        })
      );
    }
  });
});

router.post("/register", (req, res) => {
  // see if the user alread exists
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      // username isn't taken
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      console.log("threw error here");
      throw err;
    }
    if (!user) {
      res.send("Failed Login");
    } else {
      req.logIn(user, (err) => {
        if (err) {
          console.log("Failedddd");
          res.json(err);
        }
        res.setHeader("Content-Type", "application/json");
        res.json(user);
        console.log("Successful Log in");
      });
    }
  })(req, res, next);
});

router.get("/user", (req, res, next) => {
  console.log(req.user);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) res.send("Logout Error");
    else res.send("Success");
  });
});

// route to handle deleting events
router.post("/delete/:id", (req, res, next) => {
  // delete the specified event
  Event.findByIdAndDelete(req.params.id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted : ", docs);
    }
  });
});

// handle add and remove date
router.post("/dates/:id", (req, res, next) => {
  console.log("dates received: ", req.body.dates);
  Event.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) console.log("Error recieved", err);
    if (doc) {
      doc.dates = req.body.dates;
      doc.save();
    }
  });
});

router.post("/attendees/:id", (req, res, next) => {
  // Event.updateOne({_id: req.params.id}, {
  //   $set: {
  //     'dates': req.body.dates
  //   }
  // })
  // console.log(req.params.id)
  Event.findOne({ _id: req.params.id }, (err, doc) => {
    if (err) console.log("Error recieved", err);
    if (doc) {
      doc.attendees = req.body.attendees;
      doc.save();
    }
  });
});

router.post("/response/:id", (req, res, next) => {
  Event.findOne({ _id: req.params.id }, (err, doc) => {
    doc.attendees = req.body.attendees;
  });
});

module.exports = router;
