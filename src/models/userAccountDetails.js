
import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const AccountDetailsSchema = new Schema({
    userId:{
        type:String,
        default:''
    },
    accountDetails: {
        type: Object,
        default:{}
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

const accountDetails = "AccountDetails";
export default Mongoose.model(accountDetails, AccountDetailsSchema);