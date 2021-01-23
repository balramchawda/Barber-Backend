import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const submitExpSchema = new Schema({
    barberId:{
        type:String,
        default:''
    },
    rating:{
        type:String,
        default:''
    },
    text:{
        type:String,
        default:''
    },
    bookingId:{
        type:String,
        default:''
    },
    status:{
        type:Number,
        default:1
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

const submitExperience = "SubmitExperience";
export default Mongoose.model(submitExperience, submitExpSchema);