import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Services from '../../models/serviceDetails.js';
import SubscriptionHistory from '../../models/userSubscriptionHistory'
import TempServices from '../../models/storeTemporyServices'

/** 
Api to Login user
**/

let defaults = {}
const handler = async (request, reply) => {
    try {
        let payload = request.payload;
        const email = _.get(payload, 'email', "");
        const password = _.get(payload, 'password', "");
        const FBID = _.get(payload, 'FBID', '');
        // console.log(payload);
        const user = await Users.findOne({
            email
        })
        if (user) {
            return reply({
                status:false,
                message:"Email is already registered. Please enter other Email."
            })
        } else {
            var payload1={
                email:email
            }
            var obj=await new TempServices(payload1);
            await obj.save()
            return reply({
                status: true,
                message: "You can use this email."
            })
        }
    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
}


const routeConfig = {
    method: 'POST',
    path: '/user/checkEmail',
    config: {
        tags: ['api', 'users'],
        description: 'Login Barber Business Account.',
        notes: ['On success'],
        validate: {
            payload: {
                email: Joi.string().required(),
              }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}       