import uploadOnCloudinary from "../config/cloudinary.js"
import { io } from "../index.js"
import Notification from "../models/notification.model.js"

import Post from "../models/post.model.js"

export const createPost = async(req, res)=>{
   try {
    const {description} = req.body
    let newPost
    if(req.file){
        const image = await uploadOnCloudinary(req.file.path)
         newPost = Post.create({
            author:req.userId,
            description,
            image
        })
    }
    else{
       newPost = await Post.create({
            author:req.userId,
            description,
        })
    }
    return res.status(201).json(newPost)
   } catch (error) {
    return res.status(500).json(error)
   }
}

export const getPost = async(req, res)=>{
    try {
      let post = await Post.find()
      .populate("author", "firstName lastName headline userName profileImage")
      .populate("comment.user", "firstName lastName headline profileImage")
      .sort({createdAt:-1})
      return res.status(200).json(post)
    } catch (error) {
      return res.status(500).json(error)
        
    }
}

export const like = async(req, res)=>{
    try {
      let postId = req.params.id  
      let userId = req.userId
      let post = await Post.findById(postId)
      if(!post){
      return  res.status(400).json({message:"post not found"})
      }
      if(post.like.includes(userId)){
      post.like = post.like.filter((id)=> id != userId)
      }
      else{
      post.like.push(userId)
      if(userId != post.author){
      let notification = await Notification.create({
        receiver:post.author,
        relatedUser:req.userId,
        relatedPost:postId,
        type:"like"
      })
    }
      }
      await post.save()
      io.emit("likeUpdated", {postId, likes:post.like})
      return res.status(200).json(post)
    } catch (error) {
       console.log(error);
        
    }
}

export const comment = async(req, res)=>{
    try {
       const postId = req.params.id
       const userId = req.userId
       const {content} = req.body

       let post =await Post.findByIdAndUpdate(postId, {
        $push:{comment: {content, user:userId}}
       }, {returnDocument: 'after'}).populate("comment.user", "firstName lastName profileImage headline");
       io.emit("commentAdded", {postId, comm:post.comment})
       if(userId != post.author){
       let notification = await Notification.create({
        receiver:post.author,
        relatedUser:req.userId,
        relatedPost:postId,
        type:"comment"
      })
    }
     return res.status(200).json(post)
    } catch (error) {
       console.log(error);
        
    }
}