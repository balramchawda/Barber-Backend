import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const subscriptionHistorySchema = new Schema({
    subscriptionId:{
        type:String,
        default:''
    },
    currencyType:{
        type:String,
        default:''
    },
    userId:{  
        type:String,
        default:''
    },
    price:{
        type:String,
        default:''
    },
    startDate:{
        type:String,
        default:''
    },
    endDate:{
        type:String,
        default:''
    },
    totalDays:{
        type:String,
        default:''
    },
    remainingDays:{
        type:String,
        default:''
    },
    status:{
        type:Number,
        default:1
    },
    runningStatus:{
        type:String,
        default:''
    },
    planDisplayName:{
        type:String,
        default:''
    },
    isFree:{
        type:Number,
        default:0
    },//1 means free and 0 means paid
    paymentStatus:{
        type:Number,
        default:0
    },//0 means not completed 1 means completed 2 means free
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    },
});
subscriptionHistorySchema.index({
    createdAt: 1
})

const subscriptionHistory = "SubscriptionHistory";
export default Mongoose.model(subscriptionHistory, subscriptionHistorySchema);