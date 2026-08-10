import React, { useRef, useState } from 'react'
import { useContext } from 'react';
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../context/UserContext';
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";

import dp from '../assets/dp.png'
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';

function EditProfile() {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)
  let [firstName, setFirstName] = useState(userData.firstName || "")
  let [lastName, setLastName] = useState(userData.lastName || "")
  let [headline, setHeadline] = useState(userData.headline || "")
  let [userName, setUserName] = useState(userData.userName || "")
  let [location, setLocation] = useState(userData.location || "")
  let [gender, setGender] = useState(userData.gender || "")
  let [skills, setSkills] = useState(userData.skills || [])
  let [newSkills, setNewSkills] = useState("")
  let [education, setEducation] = useState(userData.education || [])
  let [newEducation, setNewEducation] = useState({
    college : "",
      degree : "",
      fieldOfStudy : ""
  })
  let [experience, setExperience] = useState(userData.experience || [])
  let [newExperience, setNewExperience] = useState({
    title : "",
      company : "",
      description : ""
  })

  const profileImage = useRef()
  const coverImage = useRef()

  const [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || dp)
  const [backendProfileImage, setBackendProfileImage] = useState(null)
  const [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || "")
  const [backendCoverImage, setBackendCoverImage] = useState(null)
  let [saving, setSaving] = useState(false)
 function addSkills(e){
  e.preventDefault()
  if(newSkills && !skills.includes(newSkills)){
    setSkills([...skills, newSkills])
  }
  setNewSkills("")
 }

 function addEducation(e){
  e.preventDefault()
  if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy){
    setEducation([...education, newEducation])
  }
  setNewEducation({
    college : "",
      degree : "",
      fieldOfStudy : ""
  })
 }
 function removeSkill(skill){
  if(skills.includes(skill)){
    setSkills(skills.filter((s)=>s!==skill))
  }
 }
 function removeEducation(edu){
  if(education.includes(edu)){
    setEducation(education.filter((e)=>e!==edu))
  }
 }
 function addExperience(e){
  e.preventDefault()
  if(newExperience.title && newExperience.company && newExperience.description){
    setExperience([...experience, newExperience])
  }
  setNewExperience({
    title : "",
      company : "",
      description : ""
  })
 }
 function removeExperiecne(exp){
  if(experience.includes(exp)){
    setExperience(experience.filter((e)=>e!==exp))
  }
 }
 function handleProfileImage(e){
  let file = e.target.files[0]
  setBackendProfileImage(file)
  setFrontendProfileImage(URL.createObjectURL(file))
 }

 function handleCoverImage(e){
  let file = e.target.files[0]
  setBackendCoverImage(file)
  setFrontendCoverImage(URL.createObjectURL(file))
 }

 const  handleSaveProfile = async(e)=>{
  e.preventDefault()
  setSaving(true)
    try {
      let formdata = new FormData();
    formdata.append("firstName", firstName)
    formdata.append("lastName", lastName)
    formdata.append("userName", userName)
    formdata.append("headline", headline)
    formdata.append("location", location)
    formdata.append("gender", gender)
    formdata.append("skills", JSON.stringify(skills))
    formdata.append("education", JSON.stringify(education))
    formdata.append("experience", JSON.stringify(experience))
    if(backendProfileImage){
      formdata.append("profileImage", backendProfileImage)
    }
    if(backendCoverImage){
      formdata.append("coverImage", backendCoverImage)
    }
    let result = await axios.put(serverUrl + "/api/user/updateprofile", formdata, {
      withCredentials:true
    })
    setUserData(result.data)
    setSaving(false)
    setEdit(false)
    } catch (error) {
      setSaving(false)
      console.log(error);
      
    }
    
 }
  return (
    <div className='w-full h-[100vh]  fixed top-0 z-[100] flex justify-center items-center'>
      <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage}/>
      <div className='w-full h-full  bg-black opacity-[0.5] top-0 left-0 absolute'></div>
      <div className='w-[90%] max-w-[500px] h-[600px] bg-white absolute shadow-lg rounded-lg p-[10px] overflow-auto'>
        <div className='absolute top-[20px] right-[20px] cursor-pointer' onClick={() => setEdit(false)}><RxCross1 className='w-[25px] h-[25px] font-semibold text-gray-800 ' /></div>
        <div className='w-full h-[150px] bg-gray-400 rounded-lg mt-[40px] overflow-hidden' onClick={()=>coverImage.current.click()}>
          <img src={frontendCoverImage} alt="" className='w-full' />
        </div>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[150px] left-[20px]' onClick={()=>profileImage.current.click()}>
          <img src={frontendProfileImage} alt="" className='h-full w-full'/>
        </div>
        <div className='h-[20px] w-[20px] bg-[#17c1ff] flex justify-center items-center relative left-[60px] top-[-5px] rounded-full cursor-pointer text-white'><FiPlus /></div>
        <div className='absolute right-[20px] top-[65px]   cursor-pointer '><FiCamera className='h-[25px] w-[25px] text-white' /></div>
        <form className='w-full flex flex-col items-center justify-center gap-[20px] mt-[40px]'>
          <input type="text" placeholder='firstName' className='w-full h-[50px] outline-none border-gray-600 border-2 text-[18px] rounded-lg px-[10px] py-[5px] ' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
          <input type="text" placeholder='lastName' className='w-full h-[50px] outline-none border-gray-600 border-2 text-[18px] rounded-lg px-[10px] py-[5px] ' value={lastName} onChange={(e)=>setLastName(e.target.value)} />
          <input type="text" placeholder='userName' className='w-full h-[50px] outline-none border-gray-600 border-2 text-[18px] rounded-lg px-[10px] py-[5px] ' value={userName} onChange={(e)=>setUserName(e.target.value)} />
          <input type="text" placeholder='headline' className='w-full h-[50px] outline-none border-gray-600 border-2 text-[18px] rounded-lg px-[10px] py-[5px] ' value={headline} onChange={(e)=>setHeadline(e.target.value)} />
          <input type="text" placeholder='location' className='w-full h-[50px] outline-none border-gray-600 border-2 text-[18px] rounded-lg px-[10px] py-[5px] ' value={location} onChange={(e)=>setLocation(e.target.value)} />
          <input type="text" placeholder='gender (male/female/other)' className='w-full h-[50px] outline-none border-gray-600 border-2 text-[18px] rounded-lg px-[10px] py-[5px] ' value={gender} onChange={(e)=>setGender(e.target.value)} />
          <div className='w-full border-gray-600 flex flex-col border-2 p-[10px] gap-[10px] rounded-lg' >
            <h1 className='text-18px font-semibold'>Skills</h1>
            {skills && <div className='flex flex-col gap-[10px]'>
              {skills.map((skill, index)=>(
               <div key={index} className='w-full h-[40px] p-[10px] border-2 border-gray-600 bg-gray-200 rounded-lg  flex justify-between items-center ' ><div>{skill}</div><RxCross1 className='w-[20px] h-[20px] cursor-pointer font-semibold text-gray-800 ' onClick={()=>removeSkill(skill)}/></div>
              ))}
            </div> }
            <div className='flex flex-col gap-[10px] items-start' >
              <input type="text" placeholder='add new skills' value={newSkills} onChange={(e)=>{setNewSkills(e.target.value)}} className='w-full h-[50px] outline-none border-gray-600 border-2 text-[16px] rounded-lg px-[10px] py-[5px] '/>
              <button className='w-[100%] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={addSkills}>Add</button>
            </div>
          </div>

          <div className='w-full border-gray-600 flex flex-col border-2 p-[10px] gap-[10px] rounded-lg' >
            <h1 className='text-18px font-semibold'>Education</h1>
            {education && <div className='flex flex-col gap-[10px]'>
              {education.map((edu, index)=>(
               <div key={index} className='w-full  p-[10px] border-2 border-gray-600 bg-gray-200 rounded-lg  flex justify-between  ' >
                <div className='flex flex-col'>
                  <div>College: {edu.college}</div>
                  <div>Degree: {edu.degree}</div>
                  <div>Field of study: {edu.fieldOfStudy}</div>
                </div><RxCross1 className='w-[20px] h-[20px] cursor-pointer font-semibold text-gray-800 ' onClick={()=>removeEducation(edu)}/></div>
             
            ))}
            </div> }
            <div className='flex flex-col gap-[10px] items-start' >
              <input type="text" placeholder='college' value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation, college:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 border-2 text-[16px] rounded-lg px-[10px] py-[5px] '/>
              <input type="text" placeholder='degree' value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation, degree:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 border-2 text-[16px] rounded-lg px-[10px] py-[5px] '/>
              <input type="text" placeholder='field of study' value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation, fieldOfStudy:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 border-2 text-[16px] rounded-lg px-[10px] py-[5px] '/>
              <button className='w-[100%] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={addEducation}>Add</button>
            </div>
          </div>

           <div className='w-full border-gray-600 flex flex-col border-2 p-[10px] gap-[10px] rounded-lg' >
            <h1 className='text-18px font-semibold'>Experience</h1>
            {experience && <div className='flex flex-col gap-[10px]'>
              {experience.map((exp, index)=>(
               <div key={index} className='w-full  p-[10px] border-2 border-gray-600 bg-gray-200 rounded-lg  flex justify-between  ' >
                <div className='flex flex-col'>
                  <div>title: {exp.title}</div>
                  <div>company: {exp.company}</div>
                  <div>description: {exp.description}</div>
                </div><RxCross1 className='w-[20px] h-[20px] cursor-pointer font-semibold text-gray-800 ' onClick={()=>removeExperiecne(exp)}/></div>
             
            ))}
            </div> }
            <div className='flex flex-col gap-[10px] items-start' >
              <input type="text" placeholder='title' value={newExperience.title} onChange={(e)=>setNewExperience({...newExperience, title:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 border-2 text-[16px] rounded-lg px-[10px] py-[5px] '/>
              <input type="text" placeholder='company' value={newExperience.company} onChange={(e)=>setNewExperience({...newExperience, company:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 border-2 text-[16px] rounded-lg px-[10px] py-[5px] '/>
              <input type="text" placeholder='description' value={newExperience.description} onChange={(e)=>setNewExperience({...newExperience, description:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 border-2 text-[16px] rounded-lg px-[10px] py-[5px] '/>
              <button className='w-[100%] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]' onClick={addExperience}>Add</button>
            </div>
          </div>
          <button className='w-[100%] h-[50px] rounded-full bg-[#4578d0] text-white mt-[40px] 'disabled={saving} onClick={(e)=>handleSaveProfile(e)}>{saving?"saving...":"Save Profile"}</button>
        </form>
      </div>

    </div>
  )
}

export default EditProfile
