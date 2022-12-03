import React, {useContext, useState} from "react"
import DatePicker from "react-datepicker"
import "./invitations.css"
import "react-datepicker/dist/react-datepicker.css"
import { addEvent } from "../../methods/api.mjs"
import { AuthContext } from "../../useAuth"
import uniq from 'lodash/uniq'

const Invitations = () => {
  let {user } = useContext(AuthContext)
  let [ title , setTitle ] = useState()
  let [ description, setDescription ] = useState()
  let [ dates , setDate ] = useState([])
  let [attendees, setAttendees ] = useState([]) 
 

  function handleSubmit(event) {
    event.preventDefault()
    
    const newEvent = {
      title : title,
      description : description,
      dates: dates,
      attendees: attendees.map(user => {
        return {username: user, response: new Array(dates.length).fill(false)}
      })
    }
    resetForm()
    setDate([])
    addEvent(newEvent, user)
  }

  function resetForm() {
    document.getElementById("new-event-form").reset()
  }

  function keepUniq(arr) {
    return arr.filter((date, i, self) => 
      self.findIndex(d => d.getTime() === date.getTime()) === i
    )
  }


  return (
    <div className="page">
      <div className="invitation-container">
        <h1 className='text-4xl'>Invitations</h1>
        <h2>Create New Rehearsal Invitation</h2>
        <form id="new-event-form">
          <div className="form-container">
            <input type="text" id="event-title" onChange={e => setTitle(e.target.value)} name="title" placeholder="rehearsal title" className="form-control" required></input>
          </div>

          <div>
            <textarea onChange={e => setDescription(e.target.value)} id="event-description" name="description" placeholder="rehearsal description" className="form-control"></textarea>
          </div>

          <div>
            <div>
              {dates && dates.map( date =>
                <div className="date-ele p-2">
                  {date.toLocaleString().split(',')[0]}
                </div>
              )}
            </div>
              <label>
                Add Rehearsal Date:
                <DatePicker onChange={date =>  {
                  setDate(keepUniq([...dates, date])) 
                  console.log('See if dates are unique: ', dates)
                  }} placeholder='select a date' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
              </label>
              
          </div>
            <label>
              Attendees:
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="invited" onChange={e => {
                setAttendees(uniq(e.target.value.split(/,\s*/)))
                console.log(attendees)
              }} placeholder="attendee1, attendee2..." required></input>
            </label>
          <div>
            <button className="text-xl block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm m-3 px-5 py-2.5 text-center" onClick={handleSubmit} type="submit">ADD EVENT</button>
          </div>
        </form>
        
      </div>
    </div>
  )
}

export default Invitations