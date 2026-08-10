import mongoose from 'mongoose'
import User from './user.model.js'
import Post from './post.model.js'
let notificationSchema = new mongoose.Schema({
  receiver : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  type:{
    type:String,
    enum:["like", "comment", "connectionAccepted"]
  },

  relatedUser : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  relatedPost : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }
}, {timestamps:true})

let Notification = mongoose.model("Notification", notificationSchema)
export default Notification