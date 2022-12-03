import axios from "axios";

export async function getSchedule(user) {
  const res = await axios({
    method: "POST",
    withCredentials: true,
    data: user,
    url: 'https://rehearsely.herokuapp.com/schedules',
  });
  if(res) {
    res.data.forEach( event => {
      event.date = new Date(event.date);
    });
    return await res.data;
  }
  else {
    console.log("res not get");
    return null;
  }
}

export async function getMyInvites(username) {
  const res = await axios({
    method: "POST",
    withCredentials: true,
    data: {username: username},
    url: 'https://rehearsely.herokuapp.com/myinvites',
  });
  if(res) {
    return await res.data;
  }
  else {
    console.log("res not get");
    return null;
  }
}

export async function addEvent(event, user) {
  axios({
    method: "POST",
    data: {
      event,
      user
    },
    withCredentials: true,
    url: 'https://rehearsely.herokuapp.com/invitations',
  }).then(res => console.log(res));
}

export async function deleteEvent(id, user) {
  axios({
    method: "POST",
    withCredentials: true,
    data: user,
    url: `https://rehearsely.herokuapp.com/delete/${id}`
  }).then(res => console.log(res));
}

export async function changeDates(id, newDates) {
  axios({
    method: "POST",
    data: {dates: newDates},
    withCredentials: true,
    url: `https://rehearsely.herokuapp.com/dates/${id}`
  }).then(res => console.log(res));
}

export async function changeAttendees(id, newAttendees) {
  axios({
    method: "POST",
    data: {attendees: newAttendees},
    withCredentials: true,
    url: `https://rehearsely.herokuapp.com/attendees/${id}`
  }).then(res => console.log(res));
}



