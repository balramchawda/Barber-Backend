import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const ratingSchema = new Schema({
    customerUserId:{
        type:String,
        default:''
    },
    barberUserId:{
        type:String,
        default:''
    },
    review:{
        type:String,
        default:''
    },
    rating:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:1
    },
    customerDetails:{
        type:Object,
        default:{}
    },
    isMine:{
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

const ratingAndReview = "RatingAndReview";
export default Mongoose.model(ratingAndReview, ratingSchema);