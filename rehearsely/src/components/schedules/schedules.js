import React, {useContext, useEffect, useState} from 'react'
import './schedules.css'
import { Link } from "react-router-dom"
import { changeAttendees, changeDates, deleteEvent, getMyInvites, getSchedule } from '../../methods/api.mjs'
import { AuthContext } from '../../useAuth'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import "bootstrap/dist/css/bootstrap.min.css"
import Modal from '../modal/Modal'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import uniq from 'lodash/uniq'

const Schedules = () => {

  const { user } = useContext(AuthContext)
  const [events, setEvents] = useState()
  const [showModal, setShowModal] = useState({})
  const [newAttendees, setAttendees ] = useState() 
  const [invitations, setInvitations ] = useState()
  const [checked, setChecked ] = useState({})

  useEffect(() => {
    if(user) {
      getSchedule(user).then((data) => {
        data.forEach(evt => {
          evt.dates = evt.dates.reduce((arr, date) => {
            return [...arr, new Date(date)]
          }, [])
        })
        setEvents(data)
        data.forEach(event => {
          setShowModal({[event._id]: false})
        })
      })
      getMyInvites(user.username).then((data) => {
        console.log("Fetching invites")
        setInvitations(data)
      })
    }
  }, [])

  function makeSchedulePrompt() {
    if(!events || events.length === 0) {
      return (
        <div className='make-schedule-prompt'>
          <div className='text-xl mt-3'>You don't have any active events, go to <Link className='underline text-xl' to='/invitations'>Invitations</Link> to make a new event</div>
        </div>
      )
    } else {
      return null
    }
  }

  function makeInvitesPrompt() {
    if(!invitations || invitations.length === 0) {
      console.log("helloooo?")
      return (
        <div className='make-invites-prompt'>
          <div className='text-xl mt-3'>You haven't been invited to an event yet</div>
        </div>
      )
    } else {
      return null
    }
  }

  // helper methods for display 
  function dropDownDates(dates) {
    return dates.map(date => 
      <Dropdown.Item >{(new Date(date).toDateString())}</Dropdown.Item>
    )
  }

  function dropDownAttendees(attendees) {
    return attendees.map(attendee => 
      <Dropdown.Item>{attendee.username}</Dropdown.Item>
    )
  }

  function dropDownResponses(dates, responses) {
    return responses.map((res, i) => {
      return <Dropdown.Item>{dates[i].toDateString()}<span className={res? 'bg-green-400' : "bg-red-500"}>{res ? ' Attending': ' Not Attending'}</span></Dropdown.Item>
    })
  }

  function keepUniq(arr) {
    return arr.filter((date, i, self) => 
      self.findIndex(d => d.getTime() === date.getTime()) === i
    )
  }

  function popupEventEditor(event, i) {
    return (
      <>
        <button className="text-xl block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="button" data-modal-toggle="defaultModal" onClick={() => {
          setShowModal({[event._id]: true})
          }} id={event._id}>
          {event.title}
        </button>
        <Modal isVisible={showModal[event._id]} onClose={() => {
         setShowModal({[event._id]: false})}}>
          
          <div className='title-edit flex flex-row items-center justify-center content-center'>
            <h3 className='ml-auto pl-12'>{event.title}</h3>
            <button className='text-base text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-1 ml-auto' onClick={() => {
              setEvents(events.slice(0, i).concat(events.slice(i+1)))
              deleteEvent(event._id, user)
              }}>Delete Event</button>
          </div>
          <div className="flex flex-col justify-center items-center">
            {event.dates.map( (date, j) =>
              <div className='edit-date flex flex-row items-center justify-around'>
                <p>{(new Date(date).toDateString())}</p>
                <button className='text-base lock text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-1 ml-3 mb-3 text-center' onClick={() => {
                  const tempEvt = events[i]
                  tempEvt.dates = tempEvt.dates.slice(0, j).concat(tempEvt.dates.slice(j+1))
                  tempEvt.attendees.forEach(attendee => { attendee.response = attendee.response.slice(0, j).concat(attendee.response.slice(j+ 1)) })
                  changeAttendees(event._id, tempEvt.attendees)
                  setEvents(events.slice(0, i).concat([tempEvt]).concat(events.slice(i+1)))
                  changeDates(event._id, events[i].dates)
                }}>Remove</button>
              </div>
            )}
            <label>
                Add Rehearsal Date:
                  <DatePicker onChange={date => {
                  const tempEvt = events[i]
                  tempEvt.dates.push(date)
                  console.log(tempEvt.dates)
                  tempEvt.dates = keepUniq(tempEvt.dates)
                  // if new unique date is added, update all attendee responses to add an extra slot
                  if(tempEvt.dates.length > events[i].dates.length) {
                    tempEvt.attendees.forEach(attendee => { attendee.response = [...attendee.response, false] })
                    changeAttendees(event._id, tempEvt.attendees)
                  }
                  setEvents(events.slice(0, i).concat([tempEvt]).concat(events.slice(i+1)))
                  changeDates(event._id, events[i].dates)
                  }} placeholder='select a date' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </label>
          </div>
          <div className="flex flex-col justify-center content-center items-center">
            {event.attendees.map( (attendee, j) => 
              <div className='edit-attendee flex flex-row items-center justify-around'>
                <p>{attendee.username}</p>
                <DropdownButton className='ml-3 mb-3' size='sm' title="Responses" drop='end'>
                    {dropDownResponses(event.dates, attendee.response)}
                  </DropdownButton>
                <button className='text-base lock text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-1 text-center ml-3 mb-3 ' onClick={() => {
                  const tempEvt = events[i]
                  tempEvt.attendees = tempEvt.attendees.slice(0, j).concat(tempEvt.attendees.slice(j+1))
                  setEvents(events.slice(0, i).concat([tempEvt]).concat(events.slice(i+1)))
                  changeAttendees(event._id, events[i].attendees)
                }}>Remove</button>
              </div>
            )}
            <label>
              Add Attendees:
              <input className="newAttendees-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="invited" onChange={e => setAttendees(e.target.value.split(/,\s*/))}></input>
              <button className="text-xl block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-3 py-2 text-center ml-2" onClick={() => {
                const attendeeObjs = uniq(newAttendees).map(user => { return {username: user, response: Array(event.dates.length).fill(false)}})
                const tempEvt = events[i]
                tempEvt.attendees = tempEvt.attendees.concat(attendeeObjs)
                setAttendees([])
                console.log(tempEvt.attendees)
                document.querySelector('.newAttendees-input').value = ""
                setEvents(events.slice(0, i).concat([tempEvt]).concat(events.slice(i+1)))
                changeAttendees(event._id, events[i].attendees)
              }}>Add</button>
            </label>
          </div>
        </Modal>
      </>
    )
  }

  function popupInviteEditor(invite, i) {
    const myresponse = invite.attendees.filter(attendee => {
      return attendee.username === user.username
    })[0].response
    

    return (
      <>
        <button className="text-xl block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="button" data-modal-toggle="defaultModal" onClick={() => {
          setShowModal({['invite' + invite._id]: true})
          }} id={invite._id}>
          {invite.title}
        </button>
        <Modal isVisible={showModal['invite' + invite._id]} onClose={() => {
         setShowModal({['invite' + invite._id]: false})}}>
          <div className='title-edit flex flex-row items-center justify-around'>
            <h3>{invite.title}</h3>
          </div>
          <div className='flex flex-row items-center justify-around'>My responses: </div>
          <div className="flex flex-col justify-center items-center">
            {invite.dates.map( (date, j) =>
              <div className='edit-response flex flex-row items-center justify-around'>
                <div className="flex justify-center content-center items-center">
                  <p className='mt-3'>{(new Date(date).toDateString())}</p>
                  <input type='checkbox' checked={checked[invite.id + invite.dates[j].toString()] || myresponse[j]} onChange={e => {}} onClick={(evt) => {
                    myresponse[j] = !myresponse[j]
                    setChecked({[invite.id + invite.dates[j].toString()]: myresponse[j]})
                    console.log("Checkbox checked: ", evt.target.checked)
                    const tempEvt = invitations[i]
                    console.log("temp ", tempEvt)
                    tempEvt.attendees = tempEvt.attendees.map(attendee => {
                      if(attendee.username === user.username) {
                        attendee.response[j] = myresponse[j]
                        return attendee
                      }
                      return attendee
                    })
                    evt.target.checked = myresponse[j]
                    changeAttendees(invite._id, tempEvt.attendees)
                    }}>
                    </input>
                 </div>
              </div>
            )}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <div className='page'>
      <div className="schedule-container">
        <h1 className='text-4xl'>Schedules</h1> 
        <div className='my-events-container'>
          <h2 className='font-light'>My events</h2>
          <div className='schedules'>
            {makeSchedulePrompt()}
              {events && events.map((event, i) => 
                <div className='event' key={event._id}>
                  {popupEventEditor(event, i)}
                  <h4 className='text-lg'>Event description:</h4>
                  <p className='text-base'>{event.description}</p>
                  <div className='dropdown-container'>
                  <DropdownButton id="dropdown-basic-button"  title="Dates">
                    {dropDownDates(event.dates)}
                  </DropdownButton>
                  <DropdownButton id="dropdown-basic-button" title="Attendees">
                    {dropDownAttendees(event.attendees)}
                  </DropdownButton>
                  </div>
                </div>)
              }
          </div>
        </div>
        <div className='my-invitations-container'>
          <h2 className='font-extralight'>My invitations</h2>
          {makeInvitesPrompt()}
          {invitations && invitations.map((invite, i) => 
            <div className='event' key={invite._id}>
              {popupInviteEditor(invite, i)}
              <h4 className='text-lg'>Event description:</h4>
              <p className='text-base'>{invite.description}</p>
              <div className='dropdown-container'>
              <DropdownButton id="dropdown-basic-button"  title="Dates">
                {dropDownDates(invite.dates)}
              </DropdownButton>
              <DropdownButton id="dropdown-basic-button" title="Attendees">
                {dropDownAttendees(invite.attendees)}
              </DropdownButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Schedules