import Hoek from 'hoek';
import Joi from 'joi';
import Helpers from '../../helpers';
import Users from '../../models/customerUser';
import BarberUser from '../../models/users';
import Bookings from '../../models/booking';
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
const fm=require('../../firebase/firebase.js')
let defaults = {}
const axios =require('axios');

/*
 * Api to Booking cancel.
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
                "MerchantID": "0000000001",
                "Login": "API0000000001",
                "Password": "Temp1234!",
                "Amount": BookingDataRefund.amountPayable,
                "ConfirmationID": BookingDataRefund.paymentId,
            }
            await axios.post('https://api.securepds.com/2.0/payments.svc/JSON/SubmitCCVoid', data)
                .then(async function(response) {
                    if(response.data.Status=="success"){
            const status = "2";
            const cancelBookingType="1" //means cancelled by customer 
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
            var barberData=await BarberUser.findOne({_id:BookingDataRefund.barberId});
                if(barberData){
                var userName=user.name;
                var deviceType=barberData.deviceType;
                var deviceToken=barberData.deviceToken;
                fm.pushnotification(userName,"Hello '"+barberData.name+"',i cancelled my booking.",deviceType,deviceToken,"CancelledBooking");
                }
            // console.log(BookingData)
            return reply({
                status: true,
                message: 'Booking cancelled successfully and also refund payment to your account.',
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
            const cancelBookingType="1" //means cancelled by customer 
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
            var barberData=await BarberUser.findOne({_id:BookingDataRefund.barberId});
                if(barberData){
                var userName=user.name;
                var deviceType=barberData.deviceType;
                var deviceToken=barberData.deviceToken;
                fm.pushnotification(userName,"Hello '"+barberData.name+"',i cancelled my booking.",deviceType,deviceToken,"CancelledBooking");
                }
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
    path: '/customerUser/cancelBooking',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Cancel booking.',
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