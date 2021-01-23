import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const NoticationCountSchema = new Schema({
    userId:{
        type:String,
        default:''
    },
    batchCount:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
});

const notificationCount = "NoticationCount";
export default Mongoose.model(notificationCount,NoticationCountSchema);