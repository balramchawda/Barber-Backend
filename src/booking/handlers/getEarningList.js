import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import ratingAndReview from '../../models/ratingAndReview'
import Favourite from '../../models/favourite'
import _ from 'lodash'
import booking from '../../models/booking';
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Get all earning list.
 **/

const handler = async (request, reply) => {
    try {
        // console.log('sss');
        const userId = await Helpers.extractUserId(request)
        const user = await BarberUser.findOne({
            _id: userId
        }).lean();
            // console.log(userId);
        if (user) {

            var totalEarning=await booking.aggregate([
                {
                    $match:{
                        $and:[{barberId:userId},{status:{$in:["0","1"]}}]
                    }
                },{
            $group: {
                _id: '$barberId',
                totalEarning: { $sum: '$amountPayable' }
            }
            }]);
            if(totalEarning.length>0){
console.log(totalEarning[0].totalEarning)
          var totalEarning= parseInt(totalEarning[0].totalEarning)
console.log(totalEarning);                
            }else{
                totalEarning=0;
            }
            const EarningData = await booking.find({
                $and: [{
                    barberId: userId
                }, {
                    status: {$in:["0","1"]}
                }]
            }, {
                _id: 1,
                userId: 1,
                barberId:1,
                bookingId: 1,
                date: 1,
                amountPayable:1,
                time: 1,
                customerDetails: 1
            });

            // console.log("EarningData",  EarningData.length);
            if (EarningData.length > 0) {
                var EarningArray = [];
                EarningData.reduce(function(promiseRes, earningData, index) {
                    return promiseRes.then(function(data) {
                        return new Promise(async function(resolve, reject) {
                            // var newUserId=ObjectID(earningData.userId);
                            const userData = await Users.findOne({
                                _id: earningData.userId
                            }, {
                                name: 1,
                                email: 1,
                                imageUrl: 1
                            });
                            earningData.customerDetails = userData;
                            EarningArray.push(earningData);
                            resolve();
                        }).catch(function(error) {
                            return reply({
                                status: false,
                                message: error.message
                            })
                        });
                    })
                }, Promise.resolve(null)).then(arrayOfResults => {
                    return reply({
                        status: true,
                        message: 'Get all earning list .',
                        data: EarningArray,
                        totalEarning:totalEarning
                    })
                })
            }else{
                return reply({
                    status:false,
                    message:"No data found.",
                    data:[],
                    totalEarning:0
                })
            }
        }
    } catch (error) {
        return reply({
            status: false,
            message: error.message,
            data: []
        })
    }
}

const routeConfig = {
    method: 'GET',
    path: '/user/getEarningList',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all earning list.',
        notes: [],
        validate: {

        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}