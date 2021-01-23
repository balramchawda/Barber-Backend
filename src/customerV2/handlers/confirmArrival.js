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
let defaults = {}

/*
 * Api to confirm arrival.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await customerUser.findOne({
            _id: userId
        }).lean();
        if (user) {
            const payload = request.payload;
            const bookingId = _.get(request, 'payload.bookingId', '');
            const verificationCode = _.get(request, 'payload.verificationCode', '');
            const BookingData = await Bookings.findOne({
                $and: [{
                    bookingId: bookingId
                }, {
                    status: "0"
                }]
            });
            if (BookingData) {
                    const status = "3"; //in process
                    const updateBookingData = await Bookings.findOneAndUpdate({
                        bookingId: bookingId
                    }, {
                        $set: {
                            status: status,
                            // cancelBookingType:cancelBookingType
                        }
                    }, {
                        new: true
                    });
                    // console.log(BookingData)
                    return reply({
                        status: true,
                        message: 'Confirmed arrival successfully.',
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
    path: '/customerv2/confirmArrival',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Confirm arrival.',
        notes: [],
        validate: {
            payload: {
                bookingId: Joi.string().required(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}