import Mongoose from 'mongoose';
const Schema = Mongoose.Schema

const imageSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
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

const images = "WorkPlaceImages";
export default Mongoose.model(images, imageSchema);