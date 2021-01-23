import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers';
import Users from '../../models/customerUser';
import BarberUser from '../../models/users';
import Bookings from '../../models/booking';
import ratingAndReview from '../../models/ratingAndReview';
import Favourite from '../../models/favourite';
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Get all booking list.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {
            const payload = request.payload;
            const status = _.get(request, 'payload.status', '');
            const BookingData = await Bookings.find({
                $and: [{
                    userId: userId
                }, {
                    status: status
                }]
            }, {
                customerDetails: 0,
                paymentId: 0
            }).populate('serviceId');
            if (BookingData.length > 0) {
                var BookingArray = [];
                BookingData.reduce(function(promiseRes, bookingData, index) {
                    return promiseRes.then(function(data) {
                        return new Promise(async function(resolve, reject) {
                            const barberId = bookingData.barberId;
                            const barberDetails = await BarberUser.findOne({
                                _id: barberId
                            }, {
                                name: 1,
                                email: 1,
                                userImage: 1,
                                chatUserId:1
                            });
                            bookingData.barberDetails = barberDetails;
                            const Favouritedata=await Favourite.findOne({$and:[{customerUserId:userId},{barberUserId:barberId}]},{isFavourite:1});
                            if(Favouritedata){
                                bookingData.isFavourite=Favouritedata.isFavourite;
                            }else{
                                bookingData.isFavourite="0";
                            }
                            BookingArray.push(bookingData);
                            resolve();
                        })
                    }).catch(function(error) {
                        return reply({
                            status: false,
                            message: error.message
                        })
                    })
                }, Promise.resolve(null)).then(arrayOfResults => {
                    return reply({
                        status: true,
                        message: "Get all my bookings.",
                        data: BookingArray
                    })
                });
            } else {
                return reply({
                    status: false,
                    message: 'No Data Found.',
                    data: []
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
    path: '/customerUser/getMyBookings',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all Barber.',
        notes: [],
        validate: {
            payload: {
                status: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}