import React, { useContext, useEffect, useState } from 'react'
import dp from '../assets/dp.png'
import moment from "moment"
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { authDataContext } from '../context/AuthContext';
import axios from "axios"
import { userDataContext } from '../context/UserContext';
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import {io} from "socket.io-client"
import ConnectionButton from './ConnectionButton';
let socket = io("http://localhost:8000")



function Post({id, author, like, comment, description, image, createdAt}) {
  let [more, setMore] = useState(false)
  let {serverUrl} = useContext(authDataContext)
  let [likes, setlikes] = useState(like || [])
  let {userData, setUserData, getPost,  profileData, setProfileData, handleGetProfile} = useContext(userDataContext)
  let [commentContent, setCommentContent] = useState("")
  let [comments, setComments] = useState(comment || [])
  let [showComment, setShowComment] = useState(false)

  const handleLike = async()=>{
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials:true
      })
      setlikes(result.data.like)
      
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleComment = async(e)=>{
    e.preventDefault()
    try {
      let result = await axios.post(serverUrl + `/api/post/comment/${id}`,{
        content:commentContent
      }, { withCredentials:true
      })
      setComments(result.data.comment)
      setCommentContent("")
      
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(()=>{
   socket.on("likeUpdated", ({postId, likes})=>{
      if(postId == id){
      setlikes(likes)
    }
   })
   socket.on("commentAdded", ({postId, comm})=>{
      if(postId == id){
      setComments(comm)
    }
   })

   return ()=>{
    socket.off("likeUpdated")
    socket.off("commentAdded")
   }
  }, [id])
  useEffect(()=>{
   getPost()
  }, [likes, comments])
  return (
    <div className='w-full min-h-[200px] bg-white rounded-lg shadow-lg p-[20px] flex flex-col gap-[10px] pb-[10px]'>
      <div className='flex justify-between items-center'>
      <div className='flex justify-start items-center gap-[10px]' onClick={()=>handleGetProfile(author.userName)}>
       <div className='w-[70px] h-[70px]  flex justify-center items-center rounded-full overflow-hidden cursor-pointer' >
                 <img src={author.profileImage || dp} alt="" className='h-full'/>
              </div>
      
      <div>
     <div className='text-[22px] font-semibold'>{`${author.firstName} ${author.lastName}`} </div>
     <div className='text-[18px]'>{author.headline} </div>
     <div className='text-[16px]'>{moment(createdAt).fromNow()} </div>
     </div>
     </div>
     <div>
   { author._id != userData._id &&   < ConnectionButton userId = {author._id}/>}
      </div>
      </div>
      <div className={`pl-[30px]  w-full ${more?"":"max-h-[100px] overflow-hidden"}  `}>{description}</div>
      <div className='pl-[30px]  text-[19px] font-semibold cursor-pointer' onClick={()=>setMore(prev=>!prev)}>{more?"read less..":"read more..."}</div>
      {image && 
       <div className='h-[300px] w-full overflow-hidden flex justify-center items-center'>
        <img src={image} alt="" className='h-full w-[70%] rounded-lg'/>
        </div>}

        <div >
          <div className='flex justify-between items-center p-[15px]  border-b-2 border-gray-500'>
         <div className='flex items-center gap-[10px] text-[18px] '><BiLike className='text-[#1ebbff] w-[20px] h-[20px] ' /><span>{likes.length}</span></div>
         <div className='flex items-center gap-[10px] text-[18px]' onClick={()=>setShowComment((prev)=>!prev)}><span > {comment.length}</span>comments</div>
          </div>

          <div className='flex justify-start items-center p-[15px] gap-[20px] '>
    {!likes.includes(userData._id) &&     <div className='flex items-center gap-[5px] cursor-pointer ' onClick={handleLike}>< BiLike className=' w-[24px] h-[24px]'/><span>Like</span> </div>}
    {likes.includes(userData._id) &&     <div className='flex items-center gap-[5px] cursor-pointer ' onClick={handleLike}>< BiSolidLike className='text-[#07a4ff] w-[24px] h-[24px]'/><span className='text-[#07a4ff]'>Liked</span> </div>}
         <div className='flex items-center gap-[5px] cursor-pointer ' onClick={()=>setShowComment((prev)=>!prev)}>< FaRegCommentDots className='w-[24px] h-[24px]'/><span>comment</span></div>
          </div>
        </div>

      {showComment &&  <div>
    
           <form className='border-b-2 border-b-gray-300 p-[10px] flex justify-between items-center' onSubmit={handleComment}>
            <input type="text" placeholder='leave a comment' className='outline-none'value={commentContent} onChange={(e)=>setCommentContent(e.target.value)}/>
            <button><LuSendHorizontal className='w-[24px] h-[24px] text-[#07a4ff]'/></button>
          </form>
         <div className='flex flex-col'>
          
          {comments.map((com)=>(
            <div className = 'flex flex-col  border-b-2 border-b-gray-300'>
              <div className='flex justify-start items-center gap-[5px] p-[10px]'>
                <div className='w-[40px] h-[40px]  flex justify-center items-center rounded-full overflow-hidden cursor-pointer' >
                 <img src={com.user.profileImage || dp} alt="" className='h-full'/>
              </div>
              <div className='text-[16px] font-semibold'>{`${com.user.firstName} ${com.user.lastName}`} </div>

              </div>
             <div className='pl-[30px]'>{com.content}</div> 
            </div>
          ))}
         </div>
        </div>}
    </div>
  )
}

export default Post
