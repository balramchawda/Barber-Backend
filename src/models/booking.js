import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const bookingSchema = new Schema({
    userId:{
        type:String,
        default:''
    },
    barberId:{
        type:String,
        default:''
    },
    bookingId:{
        type:String,
        default:''
    },
    serviceId: [{
        ref: "Services",
        type: Mongoose.Schema.Types.ObjectId      
    }],
    address:{
        type:Object,
        default:{}
    },
    location:{
        type:Object,
        default:{},
        index:'2dsphere'
    },
    convertDate:{
        type:Date,
        default:Date.now()
    },
    totalEarning:{
        type:String,
        default:''
    },
    type:{
        type:String,
        default:''
    },
    isDoorStep:{
        type:String,
        default:""
    },
    status:{
        type:String,
        default:"0"
    },
    cancelBookingType:{
        type:String,
        default:"0"
    },
    date:{
        type:String,
        default:''
    },
    time:{
        type:String,
        default:''
    },
    amountPayable:{
        type:Number,
        default:0
    },
    paymentId:{
        type:String,
        default:''
    },
    customerDetails:{
        type:Object,
        default:{}
    },
    serviceName:[],
    barberDetails:{
        type:Object,
        default:{}
    },
    verificationCode:{
        type:String,
        default:''
    },
    bookingType:{
        type:String,
        default:''
    },
    paymentStatus:{
        type:String,
        default:"Completed"
    },
    isFavourite:{
        type:Boolean,
        default:false
    },
    paymentMode:{
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

const booking= "booking";
export default Mongoose.model(booking, bookingSchema);