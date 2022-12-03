import React, { useState} from 'react'
import axios from "axios"
import './register.css'
import { Link } from 'react-router-dom'

const Register = () => {
  const [username, setRegisterUsername] = useState("")
  const [password, setRegisterPassword] = useState("")

  function register(evt) {
    evt.preventDefault()
    resetForm()
    const message = document.querySelector('.message')
    const newUser = {
      username,
      password
    }

    axios({
      method: "POST",
      data: newUser,
      withCredentials: true,
      url: "https://rehearsely.herokuapp.com/register",
    }).then((res) => {
      message.innerHTML = res.data
    })
  }

  function resetForm() {
    document.getElementById("new-user-form").reset()
  }

  return (
    <div className='page'>
      <div className="register-container ">
        <h1 className='text-4xl'>Register</h1>
        <Link to='/login'>Login</Link>
        <form id="new-user-form">
          <div className='register-form'>
            <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder="username"
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder="password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button onClick={register} type="submit">Submit</button>
          </div>
        </form>
        <p className='message flex justify-center'></p>
      </div>
    </div>
  )
}

export default Register