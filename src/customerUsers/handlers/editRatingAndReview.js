import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import ratingAndReview from '../../models/ratingAndReview'
// import Favourite from '../../models/favourite'
import _ from 'lodash'
import booking from '../../models/booking';
import CustomerUser from '../../models/customerUser'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Edit rating and review list.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await CustomerUser.findOne({
            _id: userId
        }).lean();
        if (user) {

            const ratingId = _.get(request, 'payload.ratingId', '');
            var rating = _.get(request, 'payload.rating', '');
            var review = _.get(request, 'payload.review', '');
            var reviewData=await ratingAndReview.findOne({
                _id:ratingId
            })
            if(reviewData){
                if(review){
                    review=review
                }else{
                    review=reviewData.review
                }
                if(rating){
                    rating=rating
                }else{
                    rating=reviewData.rating
                }
                            var data={
                rating:rating,
                review:review,
                updatedAt:new Date()
            }
            await ratingAndReview.findOneAndUpdate({
                _id: ratingId
            },{$set:data},{new:true})
            return reply({
                status:true,
                message:"Updated successfully."
            })
            }

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
    path: '/customerUser/editRatingAndReview',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all rating and review.',
        notes: [],
        validate: {
            payload: {
                ratingId: Joi.string().required(),
                rating:Joi.number().optional(),
                review:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}