import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.png"
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { userDataContext } from '../context/UserContext';
import EditProfile from '../components/EditProfile';
import { HiPencil } from "react-icons/hi2";
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import Post from '../components/Post';





function Home() {
  let {userData, setUserData, edit, setEdit, postData, setPostData, handleGetProfile, getPost} = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)

  let [frontendImage, setFrontendImage] = useState("")
  let [backendImage, setBackendImage] = useState("")
  let [description, setDescription] = useState("")
  let [uploadPost, setUploadPost] = useState(false)
  let image = useRef()
  let [posting, setPosting] = useState(false)
  let [suggestedUser, setSuggestedUser] = useState([])
  function handleImage(e){
   let file = e.target.files[0]
   setBackendImage(file)
   setFrontendImage(URL.createObjectURL(file))
  }

 async function handleUploadPost(){
    try {
      setPosting(false)
      let formdata = new FormData()
      formdata.append("description", description)
      if(backendImage){
        formdata.append("image", backendImage)
      }
      let result = await axios.post(serverUrl+"/api/post/create", formdata, {withCredentials:true})
      
      setUploadPost(false)
      setPosting(false)
      
      getPost()
    } catch (error) {
      setPosting(false)
      console.log(error);
      
    }
  }

  const handleSuggestedUsers = async()=>{
    try {
      let result = await axios.get(serverUrl + "/api/user/suggestedusers", {withCredentials:true})
      
     setSuggestedUser(result.data)
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
  handleSuggestedUsers()
  getPost()
  },[])
  return (
    <div className='w-full  min-h-screen bg-[#f0efe7] pt-[100px] flex justify-center items-center lg:items-start  px-[20px] pb-[50px] gap-[20px] flex-col lg:flex-row'>
     {edit && <EditProfile/>}
     <Nav/> 
     <div className='w-full h-[300px] lg:w-[25%] min-h-[200px] shadow-lg bg-white rounded-lg p-[10px] relative'>
      <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden relative cursor-pointer ' onClick={()=>{setEdit(true)}}>
      <img src={userData.coverImage || ""}  />
      <div className='absolute right-[5px] top-[15px] h-[25px] w-[25px] text-white cursor-pointer '><FiCamera /></div>
      </div>
     
     <div className='w-[70px] h-[70px] flex justify-center items-center rounded-full overflow-hidden  relative top-[-45px] left-[20px] cursor-pointer' onClick={()=>{setEdit(true)}}>
          <img src={userData.profileImage || dp} alt="" className='h-full'/>
          
      </div>
      <div className='h-[20px] w-[20px] bg-[#17c1ff] flex justify-center items-center relative top-[-75px] left-[75px] rounded-full cursor-pointer text-white'><FiPlus /></div>
      <div className=' text-gray-700 font-semibold relative bottom-[55px] left-[10px]'>
      <div className='text-[22px]'>{`${userData.firstName} ${userData.lastName}`} </div>
      <div className='text-[18px] text-gray-600'>{userData.headline || ""}</div>
      <div className='text-16px text-gray-500'>{userData.location}</div>
            <button className='w-[95%]  absolute mt-[18px] mr-[20px] h-[40px] flex items-center justify-center gap-[10px] outline-none border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>{setEdit(true)}}>Edit Profile <HiPencil />
</button>

      </div>
      </div>
    
  {uploadPost &&  <div className='w-full h-full fixed bg-black top-0 left-0 z-[100] opacity-[0.6]'></div>}
  {uploadPost &&  <div className='w-[90%] max-w-[500px] h-[600px] fixed bg-white z-[200] shadow-lg rounded-lg p-[20px] flex flex-col gap-[20px]'>
      <div className='absolute top-[20px] right-[20px] cursor-pointer' ><RxCross1 className='w-[25px] h-[25px] font-semibold text-gray-800 ' onClick={()=>setUploadPost(false)}/></div>
      <div className='flex justify-start items-center gap-[10px]'>
      <div className='w-[70px] h-[70px] flex justify-center items-center rounded-full overflow-hidden  cursor-pointer' >
          <img src={userData.profileImage || dp} alt="" className='h-full'/>
          
      </div>
      <div className='text-[22px]'>{`${userData.firstName} ${userData.lastName}`} </div>
      
      </div>
      <textarea className={`w-full ${frontendImage?"h-[200px]":"h-[550px]"} text-[19px] outline-none border-none resize-none p-[10px]`} value={description} onChange={(e)=>setDescription(e.target.value) } placeholder='What do you want to talk about..?'></textarea>
      <input type="file" ref={image} hidden onChange={handleImage}/>
      <div className='w-full h-[300px] overflow-hidden flex items-center justify-center'>
        <img className='h-full rounded-lg' src={frontendImage || ""} alt="" />
      </div>
      <div className='h-[200px] w-full flex flex-col'>
        <div className='p-[15px] border-b-2 border-gray-500 flex ' >
          <BsImage className='w-[24px] h-[24px] text-gray-500' onClick={()=>image.current.click()}/></div>
          
         <div className='flex justify-end items-center'>
          <button className='w-[100px] h-[50px] rounded-full bg-[#4578d0] text-white mt-[40px]'disabled={posting} onClick={handleUploadPost}>{posting?"posting...":"Post"}</button>
          </div> 
      </div>
      
    </div>}

     <div className='w-full lg:w-[50%] min-h-[200px]  bg-[#f0efe7] flex flex-col gap-[20px]'>
       <div className='w-full h-[100px] bg-white shadow-lg rounded-lg gap-[10px] p-[20px] flex items-center justify-center'>
       <div className='w-[70px] h-[70px]  flex justify-center items-center rounded-full overflow-hidden cursor-pointer' >
          <img src={userData.profileImage || dp} alt="" className='h-full'/>
       </div>
          <button className='w-[80%] h-[60px] px-[20px]  border-gray-500 flex hover:bg-gray-200 items-center  border-2 rounded-full 'onClick={()=>setUploadPost(true)} >Start a post
</button>
       </div>
       {postData.map((post, index)=>(
        <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} 
        createdAt={post.createdAt}/>
       ))}
      
     </div>


     <div className='w-full lg:w-[25%] min-h-[200px] shadow-lg bg-white rounded-lg hidden lg:flex flex-col p-[20px]'>
      <h1 className='text-[20px] text-gray-600 font-semibold'>Suggested Users</h1>
      { suggestedUser.length > 0 && <div> {suggestedUser.map((user)=>(
                  <div className='flex gap-[20px] items-center  hover:bg-gray-300 rounded-lg  p-[10px] border-b-2 border-b-gray-300 cursor-pointer' onClick={()=>handleGetProfile(user.userName)}>
                    <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                  <img className='h-full w-full' src={user.profileImage || dp} alt="" />
                  </div>
                    <div>
                    <div className='text-[19px] text-gray-500 font-semibold '>{`${user.firstName} ${user.lastName} ` }</div>
                    <div className='text-[16px] text-gray-500 font-semibold '>{user.headline }</div>
                    </div>
                  </div>
                )) }</div> }
              
     </div>
    </div>
  )
}

export default Home
