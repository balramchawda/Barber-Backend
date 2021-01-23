import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import _ from 'lodash'
import booking from '../../models/booking';
import customerUser from '../../models/customerUser'
import NotificationBatch from '../../models/notificationBatchCount.js';
import {
    ObjectID
} from 'mongodb';
// import pushnotification from '../../firebase/firebase.js';
const fm=require('../../firebase/firebase.js')
// const fm=require('../../firebase/firebase.js')
let defaults = {}

/*
 * Api to Get appointment list.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await BarberUser.findOne({
            _id: userId
        }).lean();
        var payload=request.payload;
        var deviceToken=payload.deviceToken;
        if (user) {
            var payload={
                userId:userId,
                batchCount:0
            }
            var notificationUpdateCount=await NotificationBatch.findOneAndUpdate({userId:userId},{$set:payload},{new:true});
            if(notificationUpdateCount){
                return reply({
                    status:true,
                    message:"Reset Notification Successfully..."
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
    path: '/allUser/resetNoticationCount',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Reset Notification Count.',
        notes: [],
        validate: {
            payload: {
                deviceToken: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}