import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
import SubscriptionPlan from '../../models/subscriptionPlan'
import SubscriptionHistory from '../../models/userSubscriptionHistory'
const Mailer = require('../../config/sendMail.js')
const randomstring = require("randomstring");
var testMerchantKey = process.env.MERCHANT_KEY
let defaults = {};
const axios = require('axios');

/**
Api to add Payment . 
  **/
const handler = async (request, reply) => {
    try {
        var id = await Helpers.extractUserId(request);
        const user = await Users.findOne({
            _id: id
        });
        if (user) {
            var subscriptionDataOne = await SubscriptionHistory.find({
                $and: [{
                    userId: user._id
                }, {
                    status: 1
                }]
            }).sort({
                "createdAt": -1
            });
            if (subscriptionDataOne.length == 2 || subscriptionDataOne.length >= 2) {
                return reply({
                    status: false,
                    message: "You have already renewed plan."
                })
            } else {
                const subscriptionId = _.get(request, 'payload.subscriptionId', '');
                const cardNumber = _.get(request, 'payload.cardNumber', '');
                const cardDate = _.get(request, 'payload.cardDate', '');
                const cardCVV = _.get(request, 'payload.cardCVV', '');
                const amount = _.get(request, 'payload.amount', '');
                var data = {
                    "MerchantKey": testMerchantKey,
                    "PaymentType": "cc",
                    "EmailAddress": user.email,
                    "CardNumber": cardNumber,
                    "ExpDate": cardDate,
                    "CVV": cardCVV,
                }
                await axios.post('https://checkout.securepds.com/checkout/checkout.svc/JSON/GenerateToken', data)
                    .then(async function(response) {
                        // console.log(response.data);
                        if (response.data.Status == "success") {
                            var data1 = {
                                "MerchantKey": testMerchantKey,
                                "Token": response.data.Confirmation,
                                "Amount": amount,
                                "FirstName": user.name,
                                "LastName": user.name,
                                "Address1": user.address.streetAddress,
                                "Address2": user.address.streetAddress,
                                "City": user.address.city,
                                "State": user.address.state,
                                "Zip": user.address.zipCode,
                                "VerStr": "N"
                            }
                            await axios.post('https://checkout.securepds.com/checkout/checkout.svc/json/SinglePayment', data1)
                                .then(async function(response) {
                                    // console.log(response.data);
                                    // console.log("name", user.name);
                                    if (response.data.Status == "success") {
                                        // console.log("userId",user._id);
                                        var userSubscriptionData = await SubscriptionHistory.findOne({
                                            $and: [{
                                                userId: user._id
                                            }, {
                                                status: 1
                                            }]
                                        })
                                        if (userSubscriptionData) {
                                            var remainingDays = userSubscriptionData.remainingDays;
                                            var totalDaysOld = userSubscriptionData.totalDays;
                                            const SubscriptionId = subscriptionId;
                                            const subscriptionData = await SubscriptionPlan.findOne({
                                                _id: SubscriptionId
                                            });

                                            // console.log("subscriptionData:",subscriptionData)
                                            var currencyType = subscriptionData.currencyType;

                                            const price = subscriptionData.price;
                                            const days = subscriptionData.days;
                                            // userData.subsRemainingDays = days;

                                            var startDate = new Date();
                                            Date.prototype.addDays = function(days) {
                                                var date = new Date(this.valueOf());
                                                date.setDate(date.getDate() + days);
                                                return date;
                                            }
                                            var startDate = userSubscriptionData.startDate;
                                            // console.log(startDate);
                                            var ss = new Date(startDate);
                                            // console.log(ss)
                                            const startDateNew = ss.addDays(parseInt(totalDaysOld));
                                            var yyyy = startDateNew.getFullYear();
                                            var mm = startDateNew.getMonth();
                                            var m1 = mm + 1;
                                            if (m1 > 0 && m1 < 10) {
                                                m1 = "0" + m1;
                                            }
                                            var dd = startDateNew.getDate()
                                            if (dd > 0 && dd < 10) {
                                                dd = "0" + dd;
                                            }
                                            var today = yyyy + '-' + m1 + '-' + dd;
                                            const endDate = startDateNew.addDays(parseInt(days));
                                            var yyyy = endDate.getFullYear();
                                            var mm = endDate.getMonth();
                                            var m1 = mm + 1;
                                            if (m1 > 0 && m1 < 10) {
                                                m1 = "0" + m1;
                                            }
                                            var dd = endDate.getDate()
                                            if (dd > 0 && dd < 10) {
                                                dd = "0" + dd;
                                            }
                                            // console.log("date1",endDate)
                                            var endDate = yyyy + '-' + m1 + '-' + dd;
                                            // console.log("date",endDate);
                                            // userData.subscriptionName=subscriptionData.planName;
                                            var planName = subscriptionData.planName;
                                            if (planName.toLowerCase() == "free") {
                                                var isFree = 1
                                                var paymentStatus = 1
                                            } else {
                                                var isFree = 0
                                                var paymentStatus = 0
                                            }
                                            var planDisplayName = subscriptionData.planDisplayName;

                                            // userData.subscriptionEndDate=endDate;
                                            const SubscriptionHistoryPayload = {
                                                subscriptionId: SubscriptionId,
                                                currencyType: currencyType,
                                                userId: user._id,
                                                price: price,
                                                startDate: today,
                                                endDate: endDate,
                                                totalDays: days,
                                                isFree: isFree,
                                                planDisplayName: planDisplayName,
                                                paymentStatus: paymentStatus,
                                                remainingDays: days
                                            }
                                            // console.log(SubscriptionHistoryPayload);
                                            const subscriptionHistorySave = await new SubscriptionHistory(SubscriptionHistoryPayload);
                                            const data = await subscriptionHistorySave.save();
                                            if (subscriptionHistorySave) {
                                                // console.log('enter')
                                                const subscriptionHistoryId = subscriptionHistorySave._id;
                                                var startTime = setInterval(async function() {
                                                    // console.log("subscriptionHistoryId:", subscriptionHistoryId);
                                                    const id = subscriptionHistoryId;
                                                    const subscriptionHistoryData = await SubscriptionHistory.findOne({
                                                        _id: id
                                                    });
                                                    var remainingDays = subscriptionHistoryData.remainingDays;
                                                    var newRemainigDays = parseInt(remainingDays) - 1;
                                                    const remainingDaysUpdate = await SubscriptionHistory.findOneAndUpdate({
                                                        _id: id
                                                    }, {
                                                        $set: {
                                                            remainingDays: String(newRemainigDays)
                                                        }
                                                    }, {
                                                        new: true
                                                    });
                                                    if (newRemainigDays == 0) {
                                                        var status = 0;
                                                        // console.log("end date=>>>>>>>>>>>>>>>>>>>>>>>>>>")
                                                        const statusUpdate = await SubscriptionHistory.findOneAndUpdate({
                                                            _id: id
                                                        }, {
                                                            $set: {
                                                                status: status
                                                            }
                                                        }, {
                                                            new: true
                                                        });
                                                        clearInterval(startTime)
                                                    }
                                                }, 1440000)
                                            }
                                        } else {
                                            // var remainingDays=userSubscriptionData.remainingDays;
                                            // var totalDaysOld=userSubscriptionData.totalDays;
                                            const SubscriptionId = subscriptionId;
                                            const subscriptionData = await SubscriptionPlan.findOne({
                                                _id: SubscriptionId
                                            });

                                            // console.log("subscriptionData:",subscriptionData)
                                            var currencyType = subscriptionData.currencyType;

                                            const price = subscriptionData.price;
                                            const days = subscriptionData.days;
                                            // userData.subsRemainingDays = days;

                                            var startDate = new Date();
                                            Date.prototype.addDays = function(days) {
                                                var date = new Date(this.valueOf());
                                                date.setDate(date.getDate() + days);
                                                return date;
                                            }
                                            // var startDate=userSubscriptionData.startDate;
                                            // console.log(startDate);
                                            var startDateNew = new Date();
                                            // console.log(ss)
                                            // const startDateNew = ss.addDays(parseInt(totalDaysOld));
                                            var yyyy = startDateNew.getFullYear();
                                            var mm = startDateNew.getMonth();
                                            var m1 = mm + 1;
                                            if (m1 > 0 && m1 < 10) {
                                                m1 = "0" + m1;
                                            }
                                            var dd = startDateNew.getDate()
                                            if (dd > 0 && dd < 10) {
                                                dd = "0" + dd;
                                            }
                                            var today = yyyy + '-' + m1 + '-' + dd;
                                            const endDate = startDateNew.addDays(parseInt(days));
                                            var yyyy = endDate.getFullYear();
                                            var mm = endDate.getMonth();
                                            var m1 = mm + 1;
                                            if (m1 > 0 && m1 < 10) {
                                                m1 = "0" + m1;
                                            }
                                            var dd = endDate.getDate()
                                            if (dd > 0 && dd < 10) {
                                                dd = "0" + dd;
                                            }
                                            // console.log("date1",endDate)
                                            var endDate = yyyy + '-' + m1 + '-' + dd;
                                            // console.log("date",endDate);
                                            var planDisplayName = subscriptionData.planDisplayName;
                                            var planName = subscriptionData.planName;
                                            if (planName.toLowerCase() == "free") {
                                                var isFree = 1
                                                var paymentStatus = 1
                                            } else {
                                                var isFree = 0
                                                var paymentStatus = 0
                                            }

                                            // userData.subscriptionEndDate=endDate;
                                            const SubscriptionHistoryPayload = {
                                                subscriptionId: SubscriptionId,
                                                currencyType: currencyType,
                                                userId: user._id,
                                                price: price,
                                                startDate: today,
                                                endDate: endDate,
                                                totalDays: days,
                                                isFree: isFree,
                                                planDisplayName: planDisplayName,
                                                paymentStatus: paymentStatus,
                                                remainingDays: days
                                            }
                                            // console.log(SubscriptionHistoryPayload);
                                            const subscriptionHistorySave = await new SubscriptionHistory(SubscriptionHistoryPayload);
                                            const data = await subscriptionHistorySave.save();
                                            if (subscriptionHistorySave) {
                                                console.log('enter')
                                                const subscriptionHistoryId = subscriptionHistorySave._id;
                                                var startTime = setInterval(async function() {
                                                    // console.log("subscriptionHistoryId:", subscriptionHistoryId);
                                                    const id = subscriptionHistoryId;
                                                    const subscriptionHistoryData = await SubscriptionHistory.findOne({
                                                        _id: id
                                                    });
                                                    var remainingDays = subscriptionHistoryData.remainingDays;
                                                    var newRemainigDays = parseInt(remainingDays) - 1;
                                                    const remainingDaysUpdate = await SubscriptionHistory.findOneAndUpdate({
                                                        _id: id
                                                    }, {
                                                        $set: {
                                                            remainingDays: String(newRemainigDays)
                                                        }
                                                    }, {
                                                        new: true
                                                    });
                                                    if (newRemainigDays == 0) {
                                                        var status = 0;
                                                        // console.log("end date=>>>>>>>>>>>>>>>>>>>>>>>>>>")
                                                        const statusUpdate = await SubscriptionHistory.findOneAndUpdate({
                                                            _id: id
                                                        }, {
                                                            $set: {
                                                                status: status
                                                            }
                                                        }, {
                                                            new: true
                                                        });
                                                        clearInterval(startTime)
                                                    }
                                                }, 1440000)
                                            }
                                        }
                                        var subscriptionDataOne = await SubscriptionHistory.find({
                                            $and: [{
                                                userId: user._id
                                            }, {
                                                status: 1
                                            }]
                                        }).sort({
                                            createdAt: -1
                                        });
                                        // console.log(subscriptionDataOne)
                                        if (subscriptionDataOne.length > 0) {
                                            // console.log(subscriptionDataOne);
                                            var newSubscriptionId = subscriptionDataOne[0]._id;
                                            await SubscriptionHistory.findOneAndUpdate({
                                                _id: newSubscriptionId
                                            }, {
                                                paymentStatus: 1
                                            }, {
                                                new: true
                                            });
                                        }
                                        return reply({
                                            status: true,
                                            message: "Payment Successfully."
                                        })
                                    } else {
                                        // return reply({
                                        //     status: false,
                                        //     message: "Payment UnSuccessfully.Please,try again later."
                                        // })
                                  return reply({
                                        status: false,
                                        message: response.data.Message
                                    })
                                    }
                                }).catch(function(err) {
                                    return reply({
                                        status: false,
                                        message: err.message
                                    })
                                })
                        }else{
                                    return reply({
                                        status: false,
                                        message: response.data.Message
                                    })
                        }
                    }).catch(function(err) {
                                    return reply({
                                        status: false,
                                        message: err.message
                                    })
                                })
            }
        } else {
            return reply({
                status: false,
                message: "Your email is incorrect."
            })
        }
    } catch (error) {
        console.log(error.message);
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/user/addPayment',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Forgot password for Barber account.',
        notes: ['On success'],
        validate: {
            payload: {
                subscriptionId: Joi.string().optional(),
                cardNumber: Joi.string().optional(),
                cardCVV: Joi.string().optional(),
                cardDate: Joi.string().optional(),
                amount: Joi.number().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}