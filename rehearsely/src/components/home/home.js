import React, {useEffect, useState, useContext} from 'react'
import { AuthContext } from '../../useAuth'
import { getMyInvites } from '../../methods/api.mjs'
import {Link} from "react-router-dom"
import './home.css'

const Home = () => {
  const { user } = useContext(AuthContext)
  const [invitations, setInvitations] = useState()

  useEffect(() => {
    if(user) {
      getMyInvites(user.username).then((data) => {
        setInvitations(data.reduce((allEvents, event) => {
          const myresponse = event.attendees.filter(attendee => {
            return attendee.username === user.username
          })[0]
          console.log(myresponse)
          return [...allEvents, ...(event.dates.reduce((arrEvents, date, i) => {
            if(myresponse.response[i]) {
              return [...arrEvents, {title: event.title, date: new Date(date)}]
            }
            else {
              return arrEvents
            }
          }, []))] 
        }, []).sort((eventA, eventB) => eventA.date - eventB.date ))
      })

    }
  }, [user])

  function intro() {
    if(!user) {
      return (
        <div className='prompt'>
          <h3>Log in or Register to continue</h3>
          <div className='nav-links'>
            <Link to="/login">Log in</Link>
            <Link to='/register'>Register</Link>
          </div>
        </div>
      )
    } 
    else {
      return (
        <div className='prompt'>
          <h3>Welcome back, {user.username}</h3>
          <div className='nav-links'>
            <Link to="/schedules">My Events</Link>
            <Link to="invitations">New Invitation</Link>
          </div>
          <div className='upcoming-events'>
            <p className='text-center text-2xl'>Upcoming Events</p>
            {invitations && 
            invitations.map(invite => 
              <div className='flex flex-row items-center justify-center'>
                <p className='text-base'>{invite.date.toDateString()}</p>
                <p className='mx-4'>{invite.title}</p>
              </div>
              )}
          </div>
        </div>
      )
    }
  }

  return (
    <div className='page'>
      <div className="home-container">
        <h1 className='text-4xl'>Home</h1>
        {intro()}
      </div>
    </div>
  )
}

export default Home