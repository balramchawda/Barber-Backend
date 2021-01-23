import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const temporyServicesSchema = new Schema({
    email:{
        type:String,
        default:''
    },
    serviceIds:[{
        ref: "Services",
        type: Mongoose.Schema.Types.ObjectId      
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const tempServices = "TempServices";
export default Mongoose.model(tempServices, temporyServicesSchema);