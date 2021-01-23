import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const adminSchema = new Schema({
    name:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    password:{
        type:String,
        default:''
    },
    role:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:""
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

const admin = "Admin";
export default Mongoose.model(admin, adminSchema);