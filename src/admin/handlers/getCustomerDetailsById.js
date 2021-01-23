import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import User from '../../models/customerUser';
import Booking from '../../models/booking';
import Barber from '../../models/users'
let defaults = {};
/**
Api to getCustomerDetails By Id. 
  **/
const handler = async (request, reply) => {
    try {
        const payload = request.payload;
        const userId = _.get(payload, 'userId', '');
        const userData = await User.findOne({
            _id: userId
        }, {
            name: 1,
            phone: 1,
            countryCode: 1,
            gender: 1,
            age: 1,
            userImage: 1,
            email: 1
        });
        const totalPaidAmount = await Booking.aggregate([{
                $match: {
                    userId: {
                        $eq: userId
                    }
                }
            },
            {
                $group: {
                    _id: "$userId",
                    amountPayable: {
                        $sum: "$amountPayable"
                    }
                }
            }
        ]);
        if (totalPaidAmount.length > 0) {
            userData.totalPaidAmount = totalPaidAmount[0].amountPayable;
        } else {
            userData.totalPaidAmount = 0;
        }
        // console.log("totalPaidAmount",totalPaidAmount);
        const paymentHistory = await Booking.find({
            $and: [{
                userId: userId
            }, {
                status: "0"
            }]
        }, {
            barberId: 1,
            barberDetails: 1,
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
        }).populate('serviceId').sort({
            createdAt: -1
        });
        var paymentHistoryArray = [];
        paymentHistory.reduce(function(promiseRes, paymentHistoryData, index) {
            return promiseRes.then(function(data) {
                return new Promise(async function(resolve, reject) {
                    const barberData = await Barber.findOne({
                        _id: paymentHistoryData.barberId
                    }, {
                        name: 1,
                        email: 1,
                        userImage: 1,
                        userType: 1
                    });
                    var serviceIdLength = paymentHistoryData.serviceId.length;
                    // console.log(serviceIdLength);
                    // var serviceData=[];
                    // for(var i=0;i<serviceIdLength;i++){
                    // var data=paymentHistoryData.serviceId[i].serviceName;
                    // var serviceCategoryName=paymentHistoryData.serviceId[i].serviceCategoryName;
                    //     // console.log("serviceName",data);
                    //     var data1={
                    //         serviceCategoryName:serviceCategoryName,
                    //         serviceName:data
                    //     }
                    //     serviceData.push(data1)
                    // }
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
                    // console.log(serviceData)
                    paymentHistoryData.serviceName = serviceData;
                    paymentHistoryData.barberDetails = barberData;
                    paymentHistoryArray.push(paymentHistoryData);
                    resolve();
                }).catch(function(error) {

                });
            })
        }, Promise.resolve(null)).then(function() {
            // userData.paymentHistory=paymentHistoryArray;
            return reply({
                status: true,
                data: userData,
                paymentHistory: paymentHistoryArray
            })
        })

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
    path: '/admin/getCustomerDetailsById',
    config: {
        tags: ['api', 'users'],
        description: 'Get all admin data.',
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