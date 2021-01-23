import Mongoose from 'mongoose'
import Constants from '../constants'
require('mongoose-double')(Mongoose);
var SchemaTypes = Mongoose.Schema.Types;

const Schema = Mongoose.Schema
const userSchema = new Schema({
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
    userType: {
        type: String,
        default: Constants.USERTYPES.USER,
        required: true
    },
    barberLiveLatitude:{
        type:String,
        default:''
    },
    barberLiveLongitude:{
        type:String,
        default:''
    },
    distance:{
        type:Number,
        default:0
    },
    serviceTypeListData:[],
    associateWith:{
        type:String,
        default:''
    },
    liveLocation:{
        type:Object,
        default:{},
        index:'2dsphere'
    },
    address: {
        type:Object,
        default:{}
    },
    subscriptionName:{
        type:String,
        default:''
    },
    subscriptionEndDate:{
        type:String,
        default:''
    },
    images: [],
    paymentHistory:[],
    totalEarnedAmount:{
        type:Number,
        default:0
    },
    serviceName:{
        type:String,
        default:''
    },
    aboutBusiness: {
        type: String,
        default: ''
    },
    outOfWork:{
        type:String,
        default:'1'
    },
    serviceName:{
        type:String,
        default:''
    },
    subsRemainingDays:{
        type:String,
        default:''
    },
    imageCount:{
        type:Number,
        default:0
    },
    chatUserId :{
      type:String,
      default:''  
    },
    isDoorStepSerivce :{
        type:Boolean,
        default:true
    },
    doorStepAmount  :{
        type:Number,
        default:10
    },
    token: {
        type: String,
        default: ''
    },
    userImage:{
        type:String,
        default:''
    },
    isOnline:{
        type:Number,
        default:1
    },
    specialOfferDeals: {
        type: String,
        default: ''
    },
    businessTypeList: [{
        ref:'BusinessType',
        type:Mongoose.Schema.Types.ObjectId
    }],
    // openingHours:[{
    //     ref:'OpeningHours',
    //     type:Mongoose.Schema.Types.ObjectId
    // }],
    myOpeningHoursArray:[],
    openingHours:[],
    serviceCategoryId:[{
        ref:'ServiceCategory',
        type:Mongoose.Schema.Types.ObjectId
    }],
    serviceTypeList: [{
        ref: "Services",
        type: Mongoose.Schema.Types.ObjectId      
    }],
    // subscriptionId:{type:Schema.Types.ObjectId,ref:"Subscriptions"},
    // subscriptionId: {
    //     ref: "SubscriptionPlan",
    //     type: Mongoose.Schema.Types.ObjectId      
    // },
    subscriptionId:{
        type:String,
        default:''
    },
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
    ratingAvg:{
        type:Number,
        default:0
    },
    isFavourite:{
        type:Boolean,
        default:true
    },
    reviewCount:{
        type:Number,
        // default:0
    },
        status:{
        type:Boolean,
        default:true
    },    
    status:{
        type:Boolean,
        default:true
    },
    ratingAndReviews:[],
    location: {
        type: Object,
        default: {},
        index: '2dsphere'
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

userSchema.index({
    createdAt: 1
})
userSchema.index({
    email: 1
})
userSchema.index({
    name: 1
})


// schema.methods.setLastLogin = function () {
//   this.lastLogin = Date.now()
// }

const users = 'Users'
export default Mongoose.model(users, userSchema)