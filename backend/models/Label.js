import mongoose from "mongoose";

const labelSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true
    }
})


export const Label=mongoose.model('Label',labelSchema)