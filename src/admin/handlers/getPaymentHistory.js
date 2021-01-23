import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers';
import CustomerUser from '../../models/customerUser';
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
 * Api to Get all Payment History.
 **/

const handler = async (request, reply) => {
    try {
     var search_data = _.get(request,'payload.text','');
     if(search_data!="" || search_data!=undefined){
            const payload = request.payload;
            // const status = _.get(request, 'payload.status', '');
            var text_data=search_data.toUpperCase();
            const BookingData = await Bookings.find({ "bookingId": { "$regex":text_data , "$options": "i" } }).populate('serviceId');
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
                                userImage: 1
                            });
                            bookingData.barberDetails = barberDetails;
                            const userId = bookingData.userId;
                            const customerDetails = await CustomerUser.findOne({
                                _id: userId
                            }, {
                                name: 1,
                                email: 1,
                                userImage: 1
                            });
                            bookingData.customerDetails = customerDetails;
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
                        message: "Get all paymentHistory.",
                        data: BookingArray
                    })
                });
            } else {
                return reply({
                    status: false,
                    message: 'No data found.',
                    data: {}
                })
            }
        }else{
            const payload = request.payload;
            // const status = _.get(request, 'payload.status', '');
            const BookingData = await Bookings.find({}).populate('serviceId');
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
                                userImage: 1
                            });
                            bookingData.barberDetails = barberDetails;
                            const userId = bookingData.userId;
                            const customerDetails = await CustomerUser.findOne({
                                _id: userId
                            }, {
                                name: 1,
                                email: 1,
                                userImage: 1
                            });
                            bookingData.customerDetails = customerDetails;
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
                        message: "Get all paymentHistory.",
                        data: BookingArray
                    })
                });
            } else {
                return reply({
                    status: false,
                    message: 'No data found.',
                    data: {}
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
    method: "POST",
    path: '/admin/getPaymentHistory',
    config: {
        tags: ['api', 'me'],
        description: 'Get all Payment History.',
        notes: [],
        validate:{
            payload:{
                page:Joi.number().optional(),
                text:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}