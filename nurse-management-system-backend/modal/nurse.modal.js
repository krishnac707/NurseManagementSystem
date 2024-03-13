import mongoose, { Schema } from "mongoose";

const nurseSchema = new Schema({
    
    name:{
        type:String,
        required:true
    },
    licenseNumber:{
        type:Number,
        required:true
    },
    dob:{
        type:Date,
        required: true 
    },
    age:{
        type:Number,
        required:true
    }
})

export default mongoose.model("Nurse",nurseSchema);