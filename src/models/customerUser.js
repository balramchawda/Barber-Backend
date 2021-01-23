import Mongoose from 'mongoose'
import Constants from '../constants'

const Schema = Mongoose.Schema
const customerUserSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        sparse: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        default: ''
    },
    chatUserId:{
        type:String,
        default:''
    },
    countryCode:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        default:''
    },
    gender:{
        type:String,
        default:''
    },
    age:{
        type:String,
        default:''
    },
    userImage:{
        type:String,
        default:''
    },
    address:{
        type:Object,
        default:{}
    },
    token: {
        type: String,
        default: ''
    },
    totalPaidAmount:{
        type:Number,
        default:0
    },
    paymentHistory:[],
    deviceToken:{
      type: String,
      default: ''  
    },
    deviceType:{
      type: String,
      default: ''  
    },
    loginType:{
        type:String,
        default:''
    },
    FBID:{
        type:String,
        default:''
    },
    GoogleID:{
        type:String,
        default:''
    },
    status:{
        type:Boolean,
        default:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

customerUserSchema.index({
    createdAt: 1
})
customerUserSchema.index({
    email: 1
})
customerUserSchema.index({
    name: 1
})


// schema.methods.setLastLogin = function () {
//   this.lastLogin = Date.now()
// }

const users = 'customerUsers'
export default Mongoose.model(users,customerUserSchema)