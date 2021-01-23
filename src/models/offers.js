import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const OfferSchema = new Schema({
    userId:{
        type:String,
        default:''
    },
    date:{
        type:String,
        default:''
    },
    startTime:{
        type:String,
        default:''
    },
    endTime:{  
        type:String,
        default:''
    },
    status:{
        type:String,
        default:'1'
    },
    price:{
        type:String,
        default:""
    },
    dealDetails:{
        type:String,
        default:""
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

const offers = "Offers";
export default Mongoose.model(offers,OfferSchema);