import React, { useContext, useEffect, useState} from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5";
import { MdHome } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import dp from '../assets/dp.png'
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'      

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false)
  let {userData, setUserData, handleGetProfile} = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)
  let [showPopup, setShowPopup] = useState(false)
  let navigate = useNavigate()
  let [searchInput, setSearchInput] = useState("")
  let [searchData, setSearchData] = useState([])
  const handleSignOut = async() => {
    try{
    let result = await axios.get(serverUrl + "/api/auth/logout", {withCredentials:true})
    setUserData(null)
    navigate("/login")
    
    }
    catch(error){
      console.log(error)
    }
    
  }
  const handleSearch = async() =>{
    try {
     let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, {withCredentials:true})
     setSearchData(result.data)
    } catch (error) {
      setSearchData([])
      console.log(error);
      
    }
  }

  useEffect(()=>{
   handleSearch()
  }, [searchInput])

  return (
    <div className='w-full h-[80px] fixed top-0 left-0 bg-[white]  shadow-lg flex justify-between items-center md:justify-around px-[8px] z-[80]'>
        <div className='flex justify-center items-center gap-[10px] '>
      <div  onClick={()=>{setActiveSearch(false)
        navigate("/") }
      }>
        <img src ={logo2} alt = "" className='w-[50px]'/>
      </div>
      { !activeSearch && <IoSearchSharp className='h-[23px] w-[23px] lg:hidden' onClick={()=>setActiveSearch(true)}/>}
     {searchData.length > 0 &&   <div className='bg-white absolute min-h-[100px] top-[90px] left-[0px] lg:left-[20px] w-[100%] shadow-lg lg:w-[700px] flex flex-col gap-[20px] 
      p-[10px]'>
          {searchData.map((search)=>(
            <div className='flex gap-[20px] items-center  hover:bg-gray-300 rounded-lg  p-[10px] border-b-2 border-b-gray-300 cursor-pointer' onClick={()=>handleGetProfile(search.userName)}>
              <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
            <img className='h-full w-full' src={search.profileImage || dp} alt="" />
            </div>
              <div>
              <div className='text-[19px] text-gray-500 font-semibold '>{`${search.firstName} ${search.lastName} ` }</div>
              <div className='text-[16px] text-gray-500 font-semibold '>{search.headline }</div>
              </div>
            </div>
          ))}

        </div>}
      <form className={`h-[40px] w-[200px] lg:w-[350px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] rounded-md ${!activeSearch ? "hidden": "flex"} `}>
        <div>
            <IoSearchSharp className='h-[23px] w-[23px]'/>
            </div>
            <input type ='text'className='w-[80%] bg-transparent outline-none ' placeholder='search users...' onChange={(e)=>setSearchInput(e.target.value)}
            value={searchInput}/>
        
      </form>
      </div>


      <div className='flex items-center justify-center gap-[10px] relative cursor-pointer'>
        
      { showPopup && <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] right-[10px] rounded-lg flex flex-col items-center  gap-[20px] p-[20px] '>
          
          <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
            <img className='h-full w-full' src={userData.profileImage || dp} alt="" />
            </div>
            <div className='text-[19px] text-gray-500 font-semibold '>{`${userData.firstName}    ${userData.lastName}` }</div>
           <button className='w-[100%] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>
            handleGetProfile(userData.userName)
           }>View Profile</button>
           <div className= 'bg-gray-500 w-[100%] h-[1px]'></div>
           <div className='w-full flex justify-start items-center gap-[10px] text-gray-600 ' onClick={()=>navigate("/network")}>
            <FaUserFriends className='h-[23px] w-[23px]'/>
            <div>My Networks</div>
        </div>
        <button className='w-[100%] h-[40px] border-2 rounded-full border-[#ec4545] text-[#ec4545] ' onClick={handleSignOut}>Sign Out</button>
        </div>
}

        <div className='lg:flex flex-col justify-center items-center text-gray-600 hidden' onClick={()=>navigate("/")}>
            <MdHome className='h-[23px] w-[23px] '/>
            <div>Home</div>
        </div>
        <div className='lg:flex flex-col justify-center items-center text-gray-600 hidden' onClick={()=>navigate("/network")}>
            <FaUserFriends className='h-[23px] w-[23px]'/>
            <div>My Networks</div>
        </div>
        <div className='flex flex-col justify-center items-center text-gray-600' onClick={()=>navigate("/notification")}>
            <IoNotifications className='h-[23px] w-[23px]'/>
            <div className='hidden md:block'>Notifications</div>
        </div>
        <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer' onClick={()=>setShowPopup(prev => !prev)}>
            <img className='h-full w-full' src={userData.profileImage || dp} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Nav
