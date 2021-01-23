import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import User from '../../models/customerUser';
import Booking from '../../models/booking';
import Barber from '../../models/users'
let defaults = {};
/**
Api to getBarberById. 
  **/
const handler = async (request, reply) => {
    try {
        console.log('ss')
        const payload = request.payload;
        const userId = _.get(payload, 'userId', '');
        console.log("userId", userId);
        const userData = await Barber.findOne({
            _id: userId
        }).populate('serviceTypeList').populate('businessTypeList');
        // console.log(userData);
        const totalEarnedAmount = await Booking.aggregate([{
                $match: {
                    barberId: {
                        $eq: userId
                    }
                }
            },
            {
                $group: {
                    _id: "$barberId",
                    amountPayable: {
                        $sum: "$amountPayable"
                    }
                }
            }
        ]);
        if (totalEarnedAmount.length > 0) {
            userData.totalEarnedAmount = totalEarnedAmount[0].amountPayable;
        } else {
            userData.totalEarnedAmount = 0;

            // console.log("totalPaidAmount",totalEarnedAmount);
        }
        const paymentHistory = await Booking.find({
            $and: [{
                barberId: userId
            }, {
                status: "0"
            }]
        }, {
            userId: 1,
            customerDetails: 1,
            bookingId: 1,
            isDoorStep: 1,
            paymentId: 1,
            amountPayable: 1,
            date: 1,
            time: 1,
            paymentMode: 1,
            address: 1,
            paymentStatus: 1,
            serviceId: 1,
        }).populate('serviceId');
        if (paymentHistory.length > 0) {
            var paymentHistoryArray = [];

            paymentHistory.reduce(function(promiseRes, paymentHistoryData, index) {
                return promiseRes.then(function(data) {
                    return new Promise(async function(resolve, reject) {
                        const barberData = await User.findOne({
                            _id: paymentHistoryData.userId
                        }, {
                            name: 1,
                            email: 1,
                            userImage: 1
                        });
                        var serviceIdLength = paymentHistoryData.serviceId.length;
                        // console.log(serviceIdLength);
                        // var serviceData=[];
                        var serviceData = '';
                        var count = 0;
                        for (var i = 0; i < serviceIdLength; i++) {
                            var data = paymentHistoryData.serviceId[i].serviceName;
                            // var serviceCategoryName=paymentHistoryData.serviceId[i].serviceCategoryName;
                            // console.log("serviceName",data);
                            serviceData = serviceData + data;
                            if (count < serviceIdLength - 1) {
                                serviceData = serviceData + '/'
                            }
                            count++;
                        }

                        paymentHistoryData.serviceName = serviceData;
                        paymentHistoryData.customerDetails = barberData;
                        paymentHistoryArray.push(paymentHistoryData);
                        resolve();
                    }).catch(function(error) {

                    });
                })
            }, Promise.resolve(null)).then(function() {
                userData.paymentHistory = paymentHistoryArray;
                // console.log(userData)
                return reply({
                    status: true,
                    data: userData,
                    paymentHistory: paymentHistoryArray
                })
            })
        } else {
            userData.paymentHistory = [];
            console.log('sss');
            return reply({
                status: true,
                data: userData,
                paymentHistoryArray: []
            })
        }


    } catch (error) {
        // console.log(error.message);
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/admin/getBarberDetailsById',
    config: {
        tags: ['api', 'users'],
        description: 'Get all barber by id.',
        notes: ['On success'],
        validate: {
            payload: {
                userId: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}