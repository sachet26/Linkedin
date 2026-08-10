import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { HiPencil } from "react-icons/hi2";
import dp from "../assets/dp.png"
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import EditProfile from '../components/EditProfile';
import Post from '../components/Post';
import { RxButton } from 'react-icons/rx';
import axios from 'axios';
import ConnectionButton from '../components/ConnectionButton';

function Profile() {
    
    let { userData, setUserData, edit, setEdit, postData, setPostData,  profileData, setProfileData, handleGetProfile } = useContext(userDataContext)
    let { serverUrl } = useContext(authDataContext)
    
    let [profilePost, setProfilePost] = useState([])
    
    useEffect(() => {
      setProfilePost(postData.filter((post)=>post.author._id == profileData._id))  
    }, [profileData])
    return (
        <div className='w-full min-h-[100vh] p-[10px] bg-[#f0efe7] flex flex-col items-center pt-[100px]'>
            <Nav />
            {edit && <EditProfile />}
            <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px] pb-[40px]'>
                <div className='bg-white pb-[40px] rounded-lg shadow-lg'>
                    <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden relative cursor-pointer ' onClick={() => { setEdit(true) }}>
                        <img src={profileData.coverImage || ""} />
                        <div className='absolute right-[5px] top-[15px] h-[25px] w-[25px] text-white cursor-pointer '><FiCamera /></div>
                    </div>

                    <div className='w-[70px] h-[70px] flex justify-center items-center rounded-full overflow-hidden  relative top-[-45px] left-[20px] cursor-pointer' onClick={() => { setEdit(true) }}>
                        <img src={profileData.profileImage || dp} alt="" className='h-full' />

                    </div>
                    <div className='h-[20px] w-[20px] bg-[#17c1ff] flex justify-center items-center relative top-[-75px] left-[75px] rounded-full cursor-pointer text-white'><FiPlus /></div>
                    <div className=' text-gray-700 font-semibold relative bottom-[55px] left-[10px]'>
                        <div className='text-[22px]'>{`${profileData.firstName} ${profileData.lastName}`} </div>
                        <div className='text-[18px] text-gray-600'>{profileData.headline || ""}</div>
                        <div className='text-16px text-gray-500'>{profileData.location}</div>
                        <div className='text-16px text-gray-500'>{`${profileData.connection.length} Connection`}</div>
                        {profileData._id == userData._id &&
                        <button className='w-[150px]  absolute mt-[18px] mr-[20px] h-[40px] flex items-center justify-center gap-[10px] outline-none border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={() => { setEdit(true) }}>Edit Profile <HiPencil />
                        </button>}
                        {profileData._id != userData._id &&
                        <div className='ml-[5px] mt-[20px]'>
                            <ConnectionButton userId = {profileData._id}/>
                        </div> }

                    </div>
                </div>

                <div className='w-full min-h-[100px] text-[22px] text-gray-600 font-semibold bg-[white] rounded-lg shadow-lg p-[20px]'>
                    {`Post (${profilePost.length})`}</div>
                {profilePost.map((post, index)=>(
                    <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} 
        createdAt={post.createdAt}/>
                ))}
                {profileData.skills.length > 0 &&
                <div className='w-full min-h-[100px]  bg-[white] rounded-lg shadow-lg p-[20px] flex flex-col gap-[10px] '>
                <div className=' text-[22px] text-gray-600 font-semibold '>
                    Skills</div>
                    <div className='flex flex-wrap justify-start items-center gap-[20px] text-gray-600 p-[20px] text-[20px]'>
                { profileData.skills.map((skill)=>(
                    <div>{skill}</div>
                ))}
           {profileData._id == userData._id &&     <button className='w-[150px] h-[40px] flex items-center justify-center gap-[10px] outline-none border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>setEdit(true)}>Add Skills</button>}
                </div>
                    </div>}
                {profileData.education.length > 0 &&
                <div className='w-full min-h-[100px]  bg-[white] rounded-lg shadow-lg p-[20px] flex flex-col gap-[10px] '>
                <div className=' text-[22px] text-gray-600 font-semibold '>
                    Education</div>
                    <div className='flex flex-col justify-start items-start gap-[20px] text-gray-600 p-[20px] text-[20px]'>
                { profileData.education.map((edu)=>(
                    <div className='flex flex-col '>
                    <div>College: {edu.college}</div>
                    <div>Degree: {edu.degree}</div>
                    <div>Field Of Study: {edu.fieldOfStudy}</div>
                    </div>
                ))}
           {profileData._id == userData._id &&     <button className='w-[150px] h-[40px] flex items-center justify-center gap-[10px] outline-none border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>setEdit(true)}>Add Education</button>}
                </div>
                    </div>}
                {profileData.experience.length > 0 &&
                <div className='w-full min-h-[100px]  bg-[white] rounded-lg shadow-lg p-[20px] flex flex-col gap-[10px] '>
                <div className=' text-[22px] text-gray-600 font-semibold '>
                    Experience</div>
                    <div className='flex flex-col justify-start items-start gap-[20px] text-gray-600 p-[20px] text-[20px]'>
                { profileData.experience.map((exp)=>(
                    <div className='flex flex-col '>
                    <div>Title: {exp.college}</div>
                    <div>Company: {exp.company}</div>
                    <div>Description: {exp.description}</div>
                    </div>
                ))}
          {profileData._id == userData._id &&      <button className='w-[150px] h-[40px] flex items-center justify-center gap-[10px] outline-none border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>setEdit(true)}>Add Experience</button>}
                </div>
                    </div>}    
            </div>
        </div>
    )
}

export default Profile
