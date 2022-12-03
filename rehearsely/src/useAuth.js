import React, { createContext} from 'react'
import axios from 'axios'
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null)
  
  async function handleLogin(user){
    const res = await axios({
      method: "POST",
      data: user,
      withCredentials: true,
      url: "https://rehearsely.herokuapp.com/login",
    })
    
    if(res.data._id) {
      setUser(res.data)
      return "Logged In Successfully"
    }
    else {
      return "The email or password is incorrect"
    }
  }

  function handleLogout() {
    setUser(null)
    // removed because cross-site reqs can't use cookies
    // axios({
    //   method: "POST",
    //   data: user,
    //   withCredentials: true,
    //   url: "http://localhost:3000/logout",
    // }).then((res) => {
    //   if(res.data === 'Success') {
    //     setUser(null)
    //     console.log("Logged out successfully")
    //   }
    //   else {
    //     console.log("Logout Failed")
    //   }
    // })
  }

  const value = {
    user,
    onLogin: handleLogin,
    onLogout: handleLogout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider