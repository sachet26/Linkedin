import mongoose, { Schema } from "mongoose";

const connectionSchema = new mongoose.Schema({
    sender : {
      type: mongoose.Schema.Types.ObjectId,
                ref:"User"  
    },
    receiver : {
      type: mongoose.Schema.Types.ObjectId,
                ref:"User"  
    },
    status:{
        type:String,
        enum:["pending", "rejected", "accepted"],
        default:"pending"
    }
}, {timestamps:true})

const Connection = mongoose.model("Connection", connectionSchema)

export default Connection