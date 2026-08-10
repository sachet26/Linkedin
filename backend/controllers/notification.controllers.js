import Notification from "../models/notification.model.js";

export const getNotification = async(req, res)=>{
    try {
       let notification = await Notification.find({receiver:req.userId})
       .populate("relatedUser", "firstName lastName profileImage")
       .populate("relatedPost", "image description")
      return res.status(200).json(notification)
    } catch (error) {
        console.log(error);
        
    }
}

export const deleteNotification = async(req, res)=>{
    try {
        let {id} = req.params
     await Notification.findByIdAndDelete({id})
       
      return res.status(200).json({message: "notification deleted"})
    } catch (error) {
        console.log(error);
        
    }
}

export const clearAllNotification = async(req, res)=>{
    try {
        
     await Notification.deleteMany({
        receiver: req.userId
     })
       
      return res.status(200).json({message:"all notification deleted"})
    } catch (error) {
        console.log(error);
        
    }
}