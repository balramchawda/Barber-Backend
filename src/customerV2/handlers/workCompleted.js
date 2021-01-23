import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers';
import customerUser from '../../models/customerUser';
import Users from '../../models/users';
import Bookings from '../../models/booking';
import ReviewAndRating from '../../models/ratingAndReview';
import Tip from '../../models/tip';
import _ from 'lodash';
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to complete work.
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
            const BookingData = await Bookings.findOne({
                bookingId: bookingId
            });
            if (BookingData) {
                const status = "1"; //completed
                const updateBookingData = await Bookings.findOneAndUpdate({
                    bookingId: bookingId
                }, {
                    $set: {
                        status: status,
                        amountPayable:payload.totalAmount
                        // cancelBookingType:cancelBookingType
                    }
                }, {
                    new: true
                });
                if (updateBookingData) {
                    const rating = _.get(request, 'payload.rating', '');
                    // const review = _.get(request, 'payload.review', '');
                    const barberUserId = BookingData.barberId;
                    const customerUserId = userId;
                    const reviewPayload = {
                        rating: rating,
                        review: "",
                        barberUserId: barberUserId,
                        customerUserId: customerUserId
                    }
                    const dataObj = await new ReviewAndRating(reviewPayload);
                    await dataObj.save();
                    const tip = _.get(request, 'payload.tip', '');
                    const tipPayload = {
                        userId: userId,
                        barberId: barberUserId,
                        price: tip
                    }
                    const tipObj = await new Tip(tipPayload);
                    await tipObj.save();
                    return reply({
                        status: true,
                        message: "Work completed successfully.",
                    })
                }
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
    path: '/customerv2/workCompleted',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'work completed',
        notes: [],
        validate: {
            payload: {
                bookingId: Joi.string().required(),
                rating: Joi.string().optional(),
                totalAmount: Joi.number().optional(),
                tip: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}