import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notification'

function App() {
  let {userData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path = '/' element = {userData ? <Home/> : <Navigate to = "/login"/>}></Route>
      <Route path = '/login' element = {userData ?<Navigate to = "/"/>:<Login/>}></Route>
      <Route path = '/signup' element = {userData ?<Navigate to = "/"/>:<Signup/>}></Route>
      <Route path = '/network' element = {userData ?<Network/>: <Navigate to = "/login"/>}></Route>
      <Route path = '/profile' element = {userData ?<Profile/>: <Navigate to = "/login"/>}></Route>
      <Route path = '/notification' element = {userData ?<Notification/>: <Navigate to = "/login"/>}></Route>
    </Routes>
  )
}

export default App
