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
const axios=require('axios');
const fm=require('../../firebase/firebase.js')
let defaults = {}


/*
 * Api to Appointment cancel.
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
            const BookingDataRefund = await Bookings.findOne({
                bookingId: bookingId
            })
            if(BookingDataRefund.bookingType=="0"){
                 var data = {
                "MerchantID": process.env.MERCHANT_ID,
                "Login": process.env.LOGIN,
                "Password": process.env.PASSWORD,
                "Amount": BookingDataRefund.amountPayable,
                "ConfirmationID": BookingDataRefund.paymentId,
            }
            await axios.post('https://api.securepds.com/2.0/payments.svc/JSON/SubmitCCVoid', data)
                .then(async function(response) {
                    if(response.data.Status=="success"){
            const status = "2";
            const cancelBookingType="2" //means cancelled by customer 
            const BookingData = await Bookings.findOneAndUpdate({
                bookingId: bookingId
            }, {
                $set: {
                    status: status,
                    cancelBookingType:cancelBookingType,
                    time:"",
                    date:""
                }
            }, {
                new: true
            });
            var customerData=await customerUser.findOne({_id:BookingDataRefund.userId});
                if(customerData){
                var userName=user.name;
                var deviceType=customerData.deviceType;
                var deviceToken=customerData.deviceToken;
                fm.pushnotification(userName,"Hello '"+customerData.name+"',i cancelled your booking.",deviceType,deviceToken,"CancelledBooking");
                }
            // console.log(BookingData)
            return reply({
                status: true,
                message: 'Booking cancelled successfully.',
            })
                    }else{
                        return reply({
                            status:false,
                            message:"Already this booking cancelled , "+response.data.Message
                        })
                    }
                }).catch(function(err){
                    return reply({
                        status:false,
                        message:err.message
                    })
                   })
            }else{
                const status = "2";
            const cancelBookingType="2" //means cancelled by customer 
            const BookingData = await Bookings.findOneAndUpdate({
                bookingId: bookingId
            }, {
                $set: {
                    status: status,
                    cancelBookingType:cancelBookingType,
                    time:"",
                    date:""
                }
            }, {
                new: true
            });
            var customerData=await customerUser.findOne({_id:BookingDataRefund.userId});
                if(customerData){
                var userName=user.name;
                var deviceType=customerData.deviceType;
                var deviceToken=customerData.deviceToken;
                fm.pushnotification(userName,"Hello '"+customerData.name+"',i cancelled your booking.",deviceType,deviceToken,"CancelledBooking");
                }
            // console.log(BookingData)
            return reply({
                status: true,
                message: 'Booking cancelled successfully.',
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
    path: '/user/cancelAppointment',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Cancel Appointment.',
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