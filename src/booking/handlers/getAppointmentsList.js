import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import _ from 'lodash'
import booking from '../../models/booking';
import serviceDetails from '../../models/serviceDetails';
import customerUser from '../../models/customerUser'
import {
    ObjectID
} from 'mongodb';
// import pushnotification from '../../firebase/firebase.js';
const fm=require('../../firebase/firebase.js')
// const fm=require('../../firebase/firebase.js')
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
            // fm.pushnotification("Balram","Hello i booked you","android","ehhni1XdRWyY5rGWfSe3vE:APA91bFVAeCmZZ4Vwg9xNI2OG1pUcK0HPjl2ZsaYvaBDe_PdzWmAapwa6xeOkwhNUJ4CzH3EU-eTA3EeXzG3Ke3xq5dTgYeuP7elsTmPs0KgZ0NjQ2NcKslVtOar5OuHBE5kpJmbArca","Booking");
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            // console.log(dd);
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
            var curMonth = months[today.getMonth()]
            var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            var lastDate = String(lastDay.getDate()).padStart(2, '0')
            // console.log(lastDate);
            if(dd<10){
                var dd=parseInt(dd);
            }
            var dateArray = [];
            var count=0;
            var k=dd;
            for (var i = dd; i <= lastDate; i++) {
                if(i<10 && (i!="01"||i!="02"||i!="03"||i!="04"||i!="05"||i!="06"||i!="07"||i!="08"||i!="09")){
                 console.log('sss',i)
                    var i="0"+i;
                }
                var newDate = curMonth + " " + i + "," + yyyy;
                var bookingDataCount = await booking.find({
                    barberId: userId,
                    date: newDate,
                    status: "0"
                }).count();
                // console.log(bookingDataCount);
                var data = {
                    date: newDate,
                    noOfBookings: bookingDataCount
                }
                dateArray.push(data);
                count++;
                k++;
                    if(count==20){
                      // console.log('enter')
                        break;
                    }
                    // console.log(parseInt(lastDate)+1)
                    var lll=parseInt(lastDate)+1
                        if(k==lll){
                    var curMonth = months[today.getMonth()+1];
                    var i=0;
            var lastDay = new Date(today.getFullYear(), today.getMonth() + 2, 0);
            var lastDate = String(lastDay.getDate()).padStart(2, '0')       
                        }
            }
            var today1=new Date();
            var curMonth = months[today1.getMonth()]

            var newDate = curMonth + " " + dd + "," + yyyy;
            // console.log(new Date(newDate));
            // const BookingData = await booking.find({
            //     $and: [{
            //             barberId: userId
            //         }, {
            //             convertDate: {
            //                 $gte:new Date(newDate)
            //             }
            //         },
            //         {
            //             status: "0"
            //         }
            //     ]
            // }).populate('serviceId').sort({
            //     date: 1
            // });
            const BookingData = await booking.find({
                $and: [{
                        barberId: userId
                    }, {
                        convertDate: {
                            $eq:new Date(newDate)
                        }
                    },
                    {
                        status: "0"
                    }
                ]
            }).populate('serviceId').sort({
                convertDate: -1
            });
            console.log(BookingData.serviceId);
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
                            // var serviceDetailsArray=[];
                            // for(var o=0;o<bookingData.serviceId.length;o++){
                            // console.log("ss",bookingData.serviceId[o]);
                            // var serviceData = await serviceDetails.findOne({
                            //     _id: ObjectID(bookingData.serviceId[o])
                            // })
                            // serviceDetailsArray.push(serviceData)
                            // }
                            // bookingData.serviceId=serviceDetailsArray;
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
                        dateArray: dateArray,
                        data: BookingArray,
                    })
                })
            } else {
                return reply({
                    status: false,
                    message: "No data found.",
                    dateArray: dateArray,
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
    method: 'GET',
    path: '/user/getAppointmentsList',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get appointment list.',
        notes: [],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}