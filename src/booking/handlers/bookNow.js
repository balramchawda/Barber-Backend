import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import Booking from '../../models/booking'
import Barber from '../../models/users'
import _ from 'lodash'
import Account from '../../models/userAccountDetails'
import {
    ObjectID
} from 'mongodb';
const fm=require('../../firebase/firebase.js')
let defaults = {}
const axios = require('axios')
const testMerchantKey = "AEAE82F9-5A34-47C3-A61E-1E8EE37BE3AD";
const MerchantKey = process.env.MERCHANT_KEY;
/** 
Api to BookingNow.
**/

const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        var user = await Users.findOne({
            _id: id
        }).lean();
        if (user) {
            // console.log('name',user)
            const payload = request.payload;
            const barberId = _.get(request, 'payload.barberId', '');
            const bookingId = await Helpers.uniqueId();
            const serviceId = _.get(request, 'payload.serviceId', '');
            const address1 = _.get(request, 'payload.address1', '');
            const address2 = _.get(request, 'payload.address2', '');
            const city = _.get(request, 'payload.city', '');
            const state = _.get(request, 'payload.state', '');
            const latitude = _.get(request, 'payload.latitude', '');
            const longitude = _.get(request, 'payload.longitude', '');
            const zip = _.get(request, 'payload.zip', '');
            var date1 = _.get(request, 'payload.date', '');
            const time = _.get(request, 'payload.time', '');
            var amountPayable = _.get(request, 'payload.amountPayable', '');
            var cardNumber = _.get(request, 'payload.cardNumber', '');
            var cardCVV = _.get(request, 'payload.cardCVV', '');
            const cardHolderName = _.get(request, 'payload.cardHolderName', '');
            var cardDate = _.get(request, 'payload.cardDate', '');
            const isDoorStep = _.get(request, 'payload.isDoorStep', '');
            const paymentId = _.get(request, 'payload.paymentId', '');
            const bookingType = _.get(request, 'payload.bookingType', '');
            // console.log(date1.split(" "))
            var dddd=date1.split(" ")
            // console.log(dddd[1].split(","));
            var ddddd=dddd[1].split(",");
            if(ddddd[0]<10){
                // console.log('sss');
                var gg=await Helpers.checkData(ddddd[0]);
                if(gg){
                    console.log('ssss')
                    var date= dddd[0]+" "+ddddd[0]+","+ddddd[1];
            }else{
                    console.log('ttttt')
                    var sss="0"+ddddd[0];
                    var date=dddd[0]+" "+sss+","+ddddd[1];
                }
            }else{
                var date=date1;
            }

            // console.log("dfdddddddddddddddddddd=>>>>>>>>>>>>>>>>>>..",date);
            if (bookingType == "0") {
                var verificationCode = await Helpers.uniqueId1();
                var paymentMode = "online";
                var paymentStatus = "completed"
            } else {
                var verificationCode = _.get(request, 'payload.verificationCode', '');
                var paymentMode = "cash";
                var paymentStatus = "pending"
            }
            // console.log("verificationCode", verificationCode);
            const paymentMode = _.get(request, 'payload.paymentMode', '');
            const type = _.get(request, 'payload.type', '');
            const location = {
                type: "Point",
                coordinates: []
            }
            var newServiceId = [];
            for (var i = 0; i < serviceId.length; i++) {
                newServiceId.push(serviceId[i]);
            }
            location.coordinates.push(parseFloat(longitude));
            location.coordinates.push(parseFloat(latitude));
            // console.log(location);
            // const newBarberId=ObjectID(bookingId);
            console.log(bookingType);
            if (bookingType == "0") {
                console.log('enter')
                var data = {
                    "MerchantKey": MerchantKey,
                    "PaymentType": "cc",
                    "EmailAddress": user.email,
                    "CardNumber": cardNumber,
                    "ExpDate": cardDate,
                    "CVV": cardCVV,
                }
                await axios.post('https://checkout.securepds.com/checkout/checkout.svc/JSON/GenerateToken', data)
                    .then(async function(response) {
                        console.log(response.data, "1");
                        if (response.data.Status == "success") {
                            var data1 = {
                                "MerchantKey": MerchantKey,
                                "Token": response.data.Confirmation,
                                "Amount": amountPayable,
                                "FirstName": user.name,
                                "LastName": user.name,
                                "Address1": address1,
                                "Address2": address2,
                                "City": city,
                                "State": state,
                                "Zip": zip,
                                "VerStr": "N"
                            }
                            await axios.post('https://checkout.securepds.com/checkout/checkout.svc/json/SinglePayment', data1)
                                .then(async function(response1) {
                                    // console.log(response1.data);
                                    // console.log("name", user.name);
                                    if (response1.data.Status == "success") {
                                        console.log("date",date)
                                        var convertDate = new Date(date);
                                        var convertAmount = parseInt(amountPayable);
                                        // console.log(convertDate);
                                        const bookingPayload = {
                                            userId: id,
                                            barberId: barberId,
                                            bookingId: bookingId,
                                            serviceId: newServiceId,
                                            address: {
                                                address1: address1,
                                                address2: address2,
                                                state: state,
                                                city: city,
                                                zip: zip
                                            },
                                            isDoorStep: isDoorStep,
                                            location: location,
                                            date: date,
                                            convertDate: convertDate,
                                            time: time,
                                            amountPayable: convertAmount,
                                            paymentId: response1.data.Confirmation,
                                            customerDetails: {},
                                            verificationCode: verificationCode,
                                            bookingType: bookingType,
                                            paymentStatus: paymentStatus,
                                            paymentMode: paymentMode,
                                            type: type
                                        }
                                        const obj = await new Booking(bookingPayload);
                                        const saveData = await obj.save();
                                        if (saveData) {
                                            const accountPayload = {
                                                userId: id,
                                                accountDetails: {
                                                    cardHolderName: cardHolderName,
                                                    cardNumber: cardNumber,
                                                    cardCVV: cardCVV,
                                                    cardDate: cardDate
                                                }
                                            }
                                            // const userObj=await Users.findOneAndUpdate({_id:id},{$set:{accountDetails:accountDetails}},{new:true});
                                            const userObj = await new Account(accountPayload);
                                            await userObj.save();
                                            var barberData=await Barber.findOne({_id:barberId});
                                            if(barberData){
                                                var userName=user.name;
                                                var deviceType=barberData.deviceType;
                                                var deviceToken=barberData.deviceToken;
                                            fm.pushnotification(userName,"Hello '"+barberData.name+"',i booked you for services",deviceType,deviceToken,"Booking");
                                                }
                                            if (userObj) {
                                                return reply({
                                                    status: true,
                                                    message: "Booking successfully",
                                                    bookingId: bookingId
                                                })
                                            }
                                        }
                                    } else {
                            console.log(response);

                                        return reply({

                                            status: false,
                                            message: response1.data.Message,
                                            bookingId: ''

                                        })
                                    }
                                }).catch(function(err) {
                                    console.log(err);
                                    return reply({
                                        status: err.Status,
                                        message: err.Message
                                    })
                                })
                        } else {
                            console.log(response);

                            return reply({
                                status: false,
                                message: response.data.Message,
                                bookingId: ''
                            })
                        }

                    }).catch(function(err) {
                        console.log(err);
                        return reply({
                            status: err.Status,
                            message: err.Message
                        })
                    })
            } else {
                var convertDate = new Date(date);
                var convertAmount = parseInt(amountPayable);
                // console.log(convertDate);
                const bookingPayload = {
                    userId: id,
                    barberId: barberId,
                    bookingId: bookingId,
                    serviceId: newServiceId,
                    address: {
                        address1: address1,
                        address2: address2,
                        state: state,
                        city: city,
                        zip: zip
                    },
                    isDoorStep: isDoorStep,
                    location: location,
                    date: date,
                    convertDate: convertDate,
                    time: time,
                    amountPayable: convertAmount,
                    paymentId: "",
                    customerDetails: {},
                    verificationCode: verificationCode,
                    bookingType: bookingType,
                    paymentStatus: paymentStatus,
                    paymentMode: paymentMode,
                    type: type
                }
                const obj = await new Booking(bookingPayload);
                const saveData = await obj.save();
                var barberData=await Barber.findOne({_id:barberId});
                if(barberData){
                var userName=user.name;
                var deviceType=barberData.deviceType;
                var deviceToken=barberData.deviceToken;
                fm.pushnotification(userName,"Hello '"+barberData.name+"',i booked you for services",deviceType,deviceToken,"Booking");
                }
                if(saveData){
                    return reply({
                        status: true,
                        message: "Booking successfully",
                        bookingId: bookingId
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
    path: '/customerUser/bookNow',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Booking now.',
        notes: [],
        validate: {
            payload: {
                barberId: Joi.string().required(),
                serviceId: Joi.array().optional(),
                address1: Joi.string().optional(),
                address2: Joi.string().optional(),
                state: Joi.string().optional(),
                city: Joi.string().optional(),
                zip: Joi.string().optional(),
                latitude: Joi.string().optional(),
                longitude: Joi.string().optional(),
                isDoorStep: Joi.string().optional(),
                type: Joi.string().optional(),
                bookingType: Joi.string().optional(),
                paymentMode: Joi.string().optional(),
                date: Joi.string().optional(),
                time: Joi.string().optional(),
                amountPayable: Joi.number().optional(),
                cardNumber: Joi.string().optional(),
                cardHolderName: Joi.string().optional(),
                cardCVV: Joi.string().optional(),
                cardDate: Joi.string().optional(),
                paymentId: Joi.string().optional(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}