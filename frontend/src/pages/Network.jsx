import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import dp from "../assets/dp.png"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";


function Network() {
  let [connections, setConnections] = useState([])
  let {serverUrl} = useContext(authDataContext)
  const handleGetRequests = async()=>{
    try {
           let result = await axios.get(`${serverUrl}/api/connection/requests`,
            {withCredentials:true})

            setConnections(result.data)
         
        } catch (error) {
       console.log(error) 
        }
  }
  const handleAcceptConnection = async(requestId)=>{
    try {
           let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{},
            {withCredentials:true})
       setConnections(connections.filter((con)=>con._id != requestId))
         
        } catch (error) {
       console.log(error) 
        }
  }
  const handleRejectConnection = async(requestId)=>{
    try {
           let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`,{},
            {withCredentials:true})
      setConnections(connections.filter((con)=>con._id != requestId))
         
        } catch (error) {
       console.log(error) 
        }
  }
  useEffect(()=>{
    handleGetRequests()
  }, [])
  return (
    <div className='w-screen h-screen bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[10px]'>
       <Nav/> 
      <div className='w-full h-[100px] flex items-center bg-white shadow-lg rounded-lg text-[22px] p-[10px] text-gray-600 '>
        Invitations {connections.length}
      </div>
   {connections.length > 0 &&   <div className='w-[90%] max-w-[700px] min-h-[100px] rounded-lg shadow-lg bg-white flex flex-col gap-[20px] p-[10px]'>
       { connections.map((connection, index)=>(
         <div className='w-full h-full flex items-center justify-between '>
          <div className='flex justify-start items-center gap-[10px] '>
          <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer'>
                      <img className='h-full w-full' src={connection.sender.profileImage || dp} alt="" />
                  </div>
           <div className='text-[19px] text-gray-700 font-semibold '>{`${connection.sender.firstName} ${connection.sender.lastName}` }</div>       
          </div>

          <div className='flex justify-center items-center'>
          <button className='text-[#18c5ff] font-semibold ' onClick={()=>handleAcceptConnection(connection._id)}>
            <IoIosCheckmarkCircleOutline className='w-[40px] h-[40px]'/>
       </button>
          <button className='text-[#ff4218] font-semibold ' onClick={()=>handleRejectConnection(connection._id)}>
            <RxCrossCircled className='w-[37px] h-[37px]'/>
          </button>
          </div>
         </div>
       ))}
      </div>
}
    </div>
  )
}

export default Network
