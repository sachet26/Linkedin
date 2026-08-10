import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import {useNavigate} from "react-router-dom"

import axios from "axios"
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'

function Login() {
  
    let [show, setShow] = useState(false)
  let navigate = useNavigate()
  let {serverUrl} = useContext(authDataContext)
  let {userData, setUserData} = useContext(userDataContext)
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let[loading, setLoading] = useState(false)
  let[err, setErr] = useState("")
  const handleSignIn= async(e)=>{
    e.preventDefault()
    setLoading(true)
    try{
    const result =  await axios.post(serverUrl + "/api/auth/login", {
       email,
       password
     },{withCredentials:true} )
     
      setUserData(result.data)
     navigate("/")
     setErr("")
     setLoading(false)
     setEmail("")
     setPassword("")
    }
    catch(error){
     
     setLoading(false)
    }
  }
  return (
    <div className='w-full h-screen bg-[white] flex flex-col justify-start items-center'>
      <div className='p-[35px] w-[100%] flex items-center'>
        <img src = {logo} alt = ''/>
      </div>
      <form className='w-[90%] max-w-[400px] h-[550px] md:shadow-xl flex flex-col  justify-center gap-[10px] p-[15px]' onSubmit={handleSignIn}>
       <h1 className='text-gray-600 font-semibold text-[30px] mb-[30px] '>Sign In</h1>
       <input type = 'email' placeholder = 'email' required className = 'w-[100%] h-[50px] border-2 border-gray-600  text-gray-800 rounded-md text-[18px] px-[20px] 'value = {email} onChange={(e)=>setEmail(e.target.value)}
       />
       <div className = 'w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 rounded-md text-[18px] relative'>
       <input type = {show ? "text":"password" } placeholder = 'password' required className = ' bg-transparent w-[100%] h-[100%]  border-none px-[20px] 'value = {password} onChange={(e)=>setPassword(e.target.value)} />
       <span className='text-[#0051ff] absolute right-[20px] mt-[10px] font-semibold cursor-pointer'onClick={()=>setShow(prev=>!prev)} >{show ? "hidden":"show"}</span>
       </div>
       {err && <p className='text-center text-red-500'>*{err}</p>}
       <button className='w-[100%] h-[50px] rounded-full bg-[#4578d0] text-white mt-[40px] 'disabled={loading} >{ loading ?"loading...":"Sign In"}</button>
       <p className='text-center cursor-pointer' onClick={()=>navigate("/signup")}>Want to create a new account ? <span className='text-[blue]'>Sign Up</span></p>
      </form>
    </div>
  )
}

export default Login
