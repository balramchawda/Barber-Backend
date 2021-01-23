import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const FavouriteImageSchema = new Schema({
    userId:{
        type:String,
        default:''
    },
    imageId:{
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

const favourite = "FavouriteImage";
export default Mongoose.model(favourite,FavouriteImageSchema);