import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const FavouriteSchema = new Schema({
    customerUserId:{
        type:String,
        default:''
    },
    barberUserId:{
        type:String,
        default:''
    },
    isFavourite:{
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
    }
});

const favourite = "Favourite";
export default Mongoose.model(favourite,FavouriteSchema);