import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import _ from 'lodash'
import booking from '../../models/booking';
import customerUser from '../../models/customerUser'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Get appointment list.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await BarberUser.findOne({
            _id: userId
        }).lean();
        if (user) {
            // var today = new Date();
            //                 var dd = String(today.getDate()).padStart(2, '0');
            //                 // console.log(dd);
            //                 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            //                 var yyyy = today.getFullYear();
            //                 var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
            //                 var curMonth = months[today.getMonth()]
            //                 var lastDay=new Date(today.getFullYear(), today.getMonth() + 1, 0);
            //                 var lastDate=String(lastDay.getDate()).padStart(2, '0')
            //                 // console.log(lastDate);

            //                 var dateArray=[];
            //                 for(var i=dd;i<=lastDate;i++)
            //                     {
            //                         var newDate=curMonth+" "+i+","+yyyy;
            //                         var bookingDataCount=await booking.find({barberId:userId,date:newDate,status:"0"}).count();
            //                         console.log(bookingDataCount);
            //                         var data={
            //                             date:newDate,
            //                             noOfBookings:bookingDataCount
            //                         }
            //                         dateArray.push(data);
            //                     }       

            //                 var newDate=curMonth+" "+dd+","+yyyy;
            // console.log(newDate);
            const payload = request.payload
            const date = _.get(payload, 'date', '');
            // const date=payload.date;
            // console.log(date);
            // const BookingData = await booking.find({
            //     $and: [{
            //         barberId: userId
            //     },{ date:date},
            //      {
            //         status: "0"
            //     }]
            // }).populate('serviceId').sort({
            //     date:1
            // });
            const BookingData = await booking.find({
                barberId: userId,
                date: date,
                status: "0"
            }).populate('serviceId').sort({
                date: 1
            });
            console.log(BookingData.length);
            if (BookingData.length > 0) {
                var BookingArray = [];
                BookingData.reduce(function(promiceRes, bookingData, index) {
                    return promiceRes.then(function(data) {
                        return new Promise(async function(resolve, reject) {
                            const id = bookingData.userId
                            const userData = await customerUser.findOne({
                                _id: id
                            }, {
                                name: 1,
                                imageUrl: 1,
                                email: 1,
                                age: 1,
                                gender: 1,
                                chatUserId:1,
                                userImage: 1
                            });
                            bookingData.customerDetails = userData;
                            BookingArray.push(bookingData);
                            resolve();
                        })
                    }).catch(function(error) {
                        return reply({
                            status: false,
                            message: error.message
                        })
                    })
                }, Promise.resolve(null)).then(arrrayOfResult => {
                    return reply({
                        status: true,
                        message: "Get Appointment List.",
                        // dateArray:dateArray,
                        data: BookingArray,
                    })
                })
            } else {
                return reply({
                    status: false,
                    message: "No data Found.",
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
    path: '/user/getAppointmentsListByDate',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get appointment list.',
        notes: [],
        validate: {
            payload: {
                date: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}