import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers';
import customerUser from '../../models/customerUser';
import Users from '../../models/users';
import Bookings from '../../models/booking';
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
const fm=require('../../firebase/firebase.js')
let defaults = {}

/*
 * Api to Appointment complete.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {
            const payload = request.payload;
            const bookingId = _.get(request, 'payload.bookingId', '');
            const status = "1";
            const BookingData = await Bookings.findOneAndUpdate({
                bookingId: bookingId
            }, {
                $set: {
                    status: status,
                }
            }, {
                new: true
            });
            const BookingData1 = await Bookings.findOneAndUpdate({
                bookingId: bookingId});

            var customerData=await customerUser.findOne({_id:BookingData1.userId});
                if(customerData){
                var userName=user.name;
                var deviceType=customerData.deviceType;
                var deviceToken=customerData.deviceToken;
                fm.pushnotification(userName,"Hello '"+customerData.name+"',Completed job.",deviceType,deviceToken,"CompletedJob");
                }
            // console.log(BookingData)
            return reply({
                status: true,
                message: 'Appointment completed successfully.',
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
    path: '/user/completeAppointment',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'complete Appointment.',
        notes: [],
        validate: {
            payload: {
                bookingId: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}