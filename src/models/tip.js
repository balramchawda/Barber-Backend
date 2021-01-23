import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const tipSchema = new Schema({
    userId:{
        type:String,
        default:''
    },
    barberId:{
        type:String,
        default:''
    },
    price:{
        type:String,
        default:''
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

const tip = "tip";
export default Mongoose.model(tip, tipSchema);