import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Offer from '../../models/offers'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to add new offer.
 **/

const handler = async (request, reply) => {
    try {
        // const id = await Helpers.extractUserId(request)
        // const user = await Users.findOne({
        //   _id: id
        // })
        const id = await Helpers.extractUserId(request)
        console.log(request.payload);
        console.log(id);
        const user = await Users.findOne({
            _id: id
        }).lean();
        if (user) {
            const payload = request.payload;
            const userId = id;
            payload.userId = userId;
            const obj = await new Offer(payload);
            const data = await obj.save();
            return reply({
                status: true,
                message: 'Added new offer successfully.',
                // data: user ? user : {}
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
    path: '/user/addNewOffer',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Add new offer.',
        notes: [],
        validate: {
            payload: {
                date: Joi.string().optional(),
                startTime: Joi.string().optional(),
                endTime: Joi.string().optional(),
                price: Joi.string().optional(),
                dealDetails: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}