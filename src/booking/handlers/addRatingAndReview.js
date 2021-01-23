import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import RatingAndReview from '../../models/ratingAndReview'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to RatingAndReview.
 **/

const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: id
        }).lean();
        if (user) {
            const payload = request.payload;
            const review = _.get(request, 'payload.review', '');
            const rating = _.get(request, 'payload.rating', '');
            const barberId = _.get(request, 'payload.barberId', '');
            const payloadData = {
                customerUserId: id,
                barberUserId: barberId,
                rating: rating,
                review: review
            }
            const dataObj = await new RatingAndReview(payloadData);
            await dataObj.save();
            return reply({
                status: true,
                message: 'Added successfully.'
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
    path: '/customerUser/ratingAndReview',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Add rating and review.',
        notes: [],
        validate: {
            payload: {
                barberId: Joi.string().optional(),
                rating: Joi.number().optional(),
                review: Joi.string().optional(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}