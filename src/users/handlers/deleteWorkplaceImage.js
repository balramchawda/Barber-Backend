import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
// import BarberUser from '../../models/users'
import ratingAndReview from '../../models/ratingAndReview'
// import Favourite from '../../models/favourite'
import _ from 'lodash'
import booking from '../../models/booking';
import CustomerUser from '../../models/users'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Delete Workplace Imgage.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await CustomerUser.findOne({
            _id: userId
        }).lean();
        if (user) {
            const id=_.get(request, 'payload.imageId', '');
            // const id=1
            var arr=user.images;
            // console.log(user.images);
            var i = arr.length;
            while(i--){
               if( arr[i] 
                && arr[i].hasOwnProperty("id") 
                && (arguments.length > 2 && arr[i]["id"] === id ) ){ 
                arr.splice(i,1);
                await CustomerUser.findOneAndUpdate({_id:userId},{$set:{images:arr}},{new:true});
                return reply({
                status:true,
                message:"Deleted Successfully.",
                // userData:userData
            })
            }
            }
            return reply({
                status:false,
                message:"Please enter valid id."
            })
            // var userData=await CustomerUser.findOne({_id:userId});      
        }
    } catch (error) {
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/user/deleteWorkplaceImage',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all rating and review.',
        notes: [],
        validate: {
            payload: {
                imageId: Joi.string().required(),
              }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}