import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
    roomNum:{
        type: String,
        required: true,
        unique: true
    },    
    status: {
        type: String,
        enum: ["VACANT", "OCCUPIED"],
        default: "VACANT"
    }
},{timestamps: true})

export const Room=mongoose.model("Room", roomSchema)