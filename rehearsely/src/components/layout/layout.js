import './layout.css'
import { useContext } from 'react'
import { Outlet, Link } from "react-router-dom"
import logo from '../../img/temporary-logo.png'
import { AuthContext } from '../../useAuth'

const Layout = () => {
  const { user , onLogout } = useContext(AuthContext)

  return (
    <>
      <div className='nav-bar'>
        <Link to="/">      
          <img src={logo} alt="calendar logo"/>
        </Link>
        <nav>
          <div className='nav-link'>
            <Link className='px-2 py-1 rounded' to="/">Home</Link>
          </div>
          <div className='nav-link'>
            <Link className='px-2 py-1 rounded' to="/schedules">Schedules</Link>
          </div>
          <div className='nav-link'>
            <Link className='px-2 py-1 rounded' to="/invitations">Invitations</Link>
          </div>  
          {/* <div className='nav-link'>
            <Link to="/login">Log in</Link>
          </div>  
          <div className='nav-link'>
            <Link to="/register">Register</Link>
          </div>   */}
        </nav>
      </div>
      <div className='user-icon'>
        {user && 
          <div className='display-user'>
            <p>Logged in as: {user.username}</p>
            <button className='logout-btn px-2 py-1 rounded' onClick={onLogout}>Log Out</button>
          </div>
        }
      </div>
      <div className='page-display'>
        <Outlet />
      </div>
    </>
  )
}

export default Layout