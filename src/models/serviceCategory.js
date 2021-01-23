import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const serviceSchema = new Schema({
    serviceCategoryName:{
        type:String,
        default:''
    },
    userType:{
        type:String,
        default:''
    },
    imageUrl:{
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

serviceSchema.index({
    createdAt:1
})
const serviceCategory = "ServiceCategory";
export default Mongoose.model(serviceCategory, serviceSchema);