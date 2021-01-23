import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
import SubmitExperience from '../../models/submitExperience';
const randomstring = require("randomstring");

let defaults = {};
/**
Api to submitExperience. 
**/
const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {
                const payload=request.payload;
                const bookingId=_.get(request,'payload.bookingId','');
                const rating=_.get(request,'payload.rating','');
                const text=_.get(request,'payload.text','');
                const submitPayload={
                    barberId:userId,
                    bookingId:bookingId,
                    rating:rating,
                    text:text
                }
                const submitObject=await new SubmitExperience(submitPayload);
                await submitObject.save();
                if(data){
            return reply({
                status: true,
                message: 'Submit your experience successfully.'
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
    path: '/user/submitExperience',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Submit experience.',
        notes: ['On success'],
        validate: {
            payload: {
                bookingId: Joi.string().optional(),
                text: Joi.string().optional(),
                rating: Joi.string().optional(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}