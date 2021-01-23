import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const businessOwnerSchema = new Schema({
    businessID:{
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

const business = "BusinessOwner";
export default Mongoose.model(business, businessOwnerSchema);