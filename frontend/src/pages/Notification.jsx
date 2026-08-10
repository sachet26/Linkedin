import React from 'react'
import Nav from '../components/Nav'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import dp from "../assets/dp.png"


function Notification() {
    let {serverUrl} = useContext(authDataContext)
    let [notificationData, setNotificationData] = useState([])
    const handleNotification = async()=>{
        try {
          let result = await axios.get(serverUrl + "/api/notification/get", {
            withCredentials:true
          })  
          
          
          setNotificationData(result.data)
        } catch (error) {
          console.log(error);
            
        }
    }
    useEffect(()=>{
     handleNotification()
    }, [])

    function handleMessage(type){
        if(type == 'like')
            return "liked your post"
       else if(type == 'comment')
            return "commented on your post"
        else
            return "accepted your connection"
    }
  return (
  <div className='w-screen h-screen bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[10px]'>
       <Nav/> 
      <div className='w-full h-[100px] flex items-center bg-white shadow-lg rounded-lg text-[22px] p-[10px] text-gray-600 '>
        Notifications {notificationData.length}
       
      </div>
        {notificationData.length > 0 &&   <div className='w-[90%] max-w-[700px] max-h-[400px] min-h-[100px] rounded-lg shadow-lg bg-white flex flex-col p-[10px] overflow-auto'>
             { notificationData.map((notification, index)=>(
               <div className='w-full h-full flex items-center justify-between border-b-2 border-b-gray-300 p-[10px] '>
                <div className='flex justify-start items-center gap-[10px] '>
                <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer'>
                            <img className='h-full w-full' src={notification.relatedUser.profileImage || dp} alt="" />
                        </div>
                 <div className='text-[19px] text-gray-700 font-semibold '>{`${notification.relatedUser.firstName} ${notification.relatedUser.lastName} ${handleMessage(notification.type)}` }</div>       
                </div>
      
                
               </div>
             ))}
            </div>
      }
      </div>
  )
}

export default Notification
