import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const serviceSchema = new Schema({
    userId: {
        ref: "Users",
        type: Mongoose.Schema.Types.ObjectId
    },
    email:{
        type:String,
        default:''
    },
    // category:[type:Schema.Types.ObjectId,ref:"Categories"],
    serviceCategoryId:{
        type:String,
        default:""
    },
    serviceCategoryName: {
        type: String,
        default: ""
    },
    gender:{
    	type:String,
    	default:''
    },
    serviceName: {
        type: String,
        default: ''
    },
    duration: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    extraCharge: {
        type: Number,
        default: 0
    },
    isDoorService:{
        type:String,
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

const service = "Services";
export default Mongoose.model(service, serviceSchema);