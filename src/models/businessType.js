import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const businessSchema = new Schema({
    businessTypeName:{
        type:String,
        default:''
    },
    userType:{
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

const businessType = "BusinessType";
export default Mongoose.model(businessType, businessSchema);