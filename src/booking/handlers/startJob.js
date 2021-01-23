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
 * Api to start job.
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
            const verificationCode = _.get(request, 'payload.verificationCode', '');
            // console.log(payload);
            const BookingData = await Bookings.findOne({
                $and: [{
                    bookingId: bookingId
                }, {
                    status: "0"
                }]
            });
            if (BookingData) {
                if (BookingData.verificationCode == verificationCode) {
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
            const BookingData1 = await Bookings.findOneAndUpdate({
                bookingId: bookingId});

            var customerData=await customerUser.findOne({_id:BookingData1.userId});
                if(customerData){
                var userName=user.name;
                var deviceType=customerData.deviceType;
                var deviceToken=customerData.deviceToken;
                fm.pushnotification(userName,"Hello '"+customerData.name+"',Start job.",deviceType,deviceToken,"StartJob");
                }
                    return reply({
                        status: true,
                        message: 'Started job successfully.',
                    })
                }else{
                    return reply({
                        status:false,
                        message:"Please enter a valid verification code."
                    })
                }
            }
            else{
                return reply({
                    status:false,
                    message:'Please enter a valid BookingId.'    
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
    path: '/user/startJob',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Start Job.',
        notes: [],
        validate: {
            payload: {
                bookingId: Joi.string().required(),
                verificationCode: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}