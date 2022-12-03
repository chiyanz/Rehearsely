import './App.css'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import AuthProvider from './useAuth'
import Home from './components/home/home'
import Schedules from './components/schedules/schedules'
import Invitations from './components/invitations/invitations'
import Layout from './components/layout/layout'
import Login from './components/login/login'
import Register from './components/register/register'
import ProtectedRoute from './ProtectedRoute'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/schedules' element={
              <ProtectedRoute>
                <Schedules />
              </ProtectedRoute>
            }></Route>
            <Route path='/invitations' element={
              <ProtectedRoute>
                <Invitations />
              </ProtectedRoute>
            }></Route>
            <Route index element={<Home />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
