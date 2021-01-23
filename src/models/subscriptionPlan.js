import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const subscriptionSchema = new Schema({
    planName:{
        type:String,
        default:''
    },
    currencyType:{
        type:String,
        default:'$'
    },
    userType:{  
        type:String,
        default:''
    },
    price:{
        type:String,
        default:''
    },
    days:{
        type:String,
        default:''
    },
    planDisplayName:{
        type:String,
        default:''
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
});

const subscriptionPlan = "SubscriptionPlan";
export default Mongoose.model(subscriptionPlan, subscriptionSchema);