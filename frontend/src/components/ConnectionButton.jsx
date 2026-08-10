import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { userDataContext } from '../context/UserContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const socket = io("https://linkedin-backend-i4ia.onrender.com")

function ConnectionButton({userId}) {
    let {serverUrl} = useContext(authDataContext)
    let {userData} = useContext(userDataContext)
    let [status, setStatus] = useState("")
    let navigate = useNavigate()
    const handleSendConnection = async()=>{
        try {
           let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, 
            {withCredentials:true})

            
         
        } catch (error) {
       console.log(error) 
        }

    }
    const handleRemoveConnection = async()=>{
        try {
           let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,
            {withCredentials:true})

            
         
        } catch (error) {
       console.log(error) 
        }

    }
    const handleGetStatus = async()=>{
        try {
           let result = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`, 
            {withCredentials:true})

            console.log(result)
            setStatus(result.data.status)
        } catch (error) {
       console.log(error) 
        }

    }

    useEffect(()=>{
     socket.emit("register", userData._id)
     handleGetStatus()
     socket.on("statusUpdate", ({updatedUserId, newStatus})=>{
        if(updatedUserId == userId){
        setStatus(newStatus)
        }
     })
     return () =>{
        socket.off("statusUpdate")
     }
    }, [userId])

   const handleClick = async()=>{
      if(status == 'disconnect'){
     await  handleRemoveConnection()
      }
      else if(status == 'received'){
      navigate("/network")
      }
      else{
      await handleSendConnection()
      }
     
   }
  return (
    
      <button className='min-w-[100px] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={handleClick} disabled = {status == "pending"}>{status}</button>
    
  )
}

export default ConnectionButton
