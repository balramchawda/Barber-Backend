import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const stateSchema = new Schema({
    country:{
        type:String,
        default:''
    },
    state:{
        type:String,
        default:''
    },
    shortName:{
        type:String,
        default:''
    }
});

const tips = "states";
export default Mongoose.model(tips, stateSchema);