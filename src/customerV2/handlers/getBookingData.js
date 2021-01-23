import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers';
import customerUser from '../../models/customerUser';
import Barber from '../../models/users';
import Bookings from '../../models/booking';
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Get Booking Data.
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
                    bookingId: bookingId
            });
            if (BookingData) {
                    var barberData=await Barber.findOne({_id:BookingData.barberId},{userImage:1,email:1,name:1});
                    BookingData.barberDetails=barberData;
                   // console.log(BookingData)
                    return reply({
                        status: true,
                        message: 'Get Booking Data.',
                        data:BookingData
                    })
            }else{
                    return reply({
                        status: false,
                        message: 'Please use currect bookingId',
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
    path: '/customerv2/getBookingData',
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