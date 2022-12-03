import './login.css'
import React, {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../../useAuth'
import { Link } from 'react-router-dom'

const Login = () => {
  const [ username , setLoginUsername ] = useState()
  const [ password, setLoginPassword ] = useState()
  const [ resStr, setResStr ] = useState("")

  const { user, onLogin } = useContext(AuthContext)

  useEffect(() => {
    if(!user) {
      setResStr("")
    }
  }, [user])

  async function login() {
    const loginInfo = {
      username,
      password
    }
    onLogin(loginInfo).then(str => setResStr(str))
    resetForm()
  }

  function resetForm() {
    const usernameInput = document.querySelector('.username-input')
    const passwordInput = document.querySelector('.password-input')
    usernameInput.value = ''
    passwordInput.value = ''
  }

  return (
    <div className='page'>
      <div className="login-container">
        <h1 className='text-4xl'>Login</h1>
        <Link to='/register'>Register</Link>
        <div className='login-form'>
          <input
            className='username-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder="username"
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <input
            className='password-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder="password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={login}>Log in</button>
        </div>
        <p className='flex justify-center'>{resStr}</p>
      </div>
    </div>
  )
}

export default Login