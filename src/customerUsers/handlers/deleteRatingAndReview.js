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
 * Api to Delete Rating and Review.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await CustomerUser.findOne({
            _id: userId
        }).lean();
        if (user) {

            const ratingId = _.get(request, 'payload.ratingId', '');
            // var rating = _.get(request, 'payload.rating', '');
            // var review = _.get(request, 'payload.review', '');
            var reviewData=await ratingAndReview.findOneAndRemove({
                _id:ratingId
            })
            return reply({
                status:true,
                message:"Deleted Successfully."
            })
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
    path: '/customerUser/deleteRatingAndReview',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all rating and review.',
        notes: [],
        validate: {
            payload: {
                ratingId: Joi.string().required(),
              }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}