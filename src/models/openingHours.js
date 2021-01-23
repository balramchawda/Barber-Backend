import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const OpeningSchema = new Schema({
    dayName:{
        type:String,
        default:''
    },
    startTime:{
        type:String,
        default:''
    },
    endTime:{  
        type:String,
        default:''
    },
    status:{
        type:String,
        default:""
    },
    isCheck :{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const openingHours = "OpeningHours";
export default Mongoose.model(openingHours,OpeningSchema);