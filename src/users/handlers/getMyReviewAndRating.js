import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import ratingAndReview from '../../models/ratingAndReview'
// import Favourite from '../../models/favourite'
import _ from 'lodash'
import booking from '../../models/booking';
import customerUser from '../../models/users'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Get all rating and review list.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await BarberUser.findOne({
            _id: userId
        }).lean();
        // console.log(userId);
        if (user) {
        //     const ReviewData = await ratingAndReview.find({
        //         $and: [{
        //             barberUserId: userId
        //         }, {
        //             status: 1
        //         }]
        //     });
        //     if (ReviewData.length > 0) {
        //         var ReviewArray = [];
        //         ReviewData.reduce(function(promiseRes, reviewData, index) {
        //             return promiseRes.then(function(data) {
        //                 return new Promise(async function(resolve, reject) {
        //                     const userData = await Users.findOne({
        //                         _id: reviewData.customerUserId
        //                     }, {
        //                         name: 1,
        //                         email: 1,
        //                         userImage: 1
        //                     });
        //                     reviewData.customerDetails = userData;
        //                     ReviewArray.push(reviewData);
        //                     resolve();
        //                 }).catch(function(error) {
        //                     return reply({
        //                         status: false,
        //                         message: error.message
        //                     })
        //                 });
        //             })
        //         }, Promise.resolve(null)).then(arrayOfResults => {
        //             return reply({
        //                 status: true,
        //                 message: 'Get all rating and review list .',
        //                 data: ReviewArray
        //             })
        //         })
        //     }else{
        //     return reply({
        //         status:false,
        //         message:"No data found.",
        //         data:[]
        //     })
        // }
        var barberId=userId;
        const ReviewData = await ratingAndReview.find({
                barberUserId: barberId
            }).sort({
                createdAt: -1
            });
            if (ReviewData.length > 0) {
                const totalCount = await ratingAndReview.count({
                    barberUserId: barberId
                });
                // console.log(totalCount);
                const finalrating5 = await ratingAndReview.count({
                    $and: [{
                        barberUserId: barberId
                    }, {
                        rating: 5
                    }]
                });
                // console.log(finalrating5);
                const rating5 = ((finalrating5 / totalCount) * 100) ;
                const rating5P=Math.round(rating5);
                // const rating5P = rating5.toFixed(2);
                const finalrating4 = await ratingAndReview.count({
                    $and: [{
                        barberUserId: barberId
                    }, {
                        rating: 4
                    }]
                });
                // console.log(finalrating4);
                const rating4 = ((finalrating4 / totalCount ) * 100) ;
                // const rating4P = rating4.toFixed(2);
                const rating4P=Math.round(rating4);

                const finalrating3 = await ratingAndReview.count({
                    $and: [{
                        barberUserId: barberId
                    }, {
                        rating: 3
                    }]
                });
                // console.log(finalrating3);
                const rating3 = ((finalrating3 / totalCount) * 100) ;
                // const rating3P = rating3.toFixed(2);
                const rating3P=Math.round(rating3);

                const finalrating2 = await ratingAndReview.count({
                    $and: [{
                        barberUserId: barberId
                    }, {
                        rating: 2
                    }]
                });
                // console.log(finalrating2);
                const rating2 = ((finalrating2 / totalCount) *100 ) ;
                // const rating2P = rating2.toFixed(2);
                const rating2P=Math.round(rating2);

                const finalrating1 = await ratingAndReview.count({
                    $and: [{
                        barberUserId: barberId
                    }, {
                        rating: 1
                    }]
                });
                // console.log(finalrating1);
                const rating1 = ((finalrating1 /totalCount) * 100 ) ;
                // const rating1P = rating1.toFixed(2);
                const rating1P=Math.round(rating1);

                const query = [{
                    $match: {
                        barberUserId: {
                            $eq: barberId
                        }
                    }
                }, {
                    $group: {
                        _id: "$barberUserId",
                        average: {
                            $avg: "$rating"
                        }
                    }
                }]
                var barberData=await BarberUser.findOne({_id:ObjectID(barberId)},{name:1});
                // console.log(barberData);
                const ratingAvg = await ratingAndReview.aggregate(query);
                // var finalratingAvg = (ratingAvg[0].average).toFixed(1);
                var finalratingAvg = (ratingAvg[0].average|0);
                // console.log(finalratingAvg);
                if(finalratingAvg){
                    var finalratingAvg=finalratingAvg
                }else{
                    var finalratingAvg=0.0
                }
                var ReviewArray = [];
                ReviewData.reduce(function(promiseRes, reviewData, index) {
                    return promiseRes.then(function(data) {
                        return new Promise(async function(resolve, reject) {
                            // console.log(reviewData.customerUserId)
                            // console.log("cu",reviewData.customerUserId);
                            // console.log('user',userId);
                            if(reviewData.customerUserId==userId){
                                reviewData.isMine=true;
                            }else{
                                reviewData.isMine=false;
                            }
                            const userData = await Users.findOne({
                                _id: reviewData.customerUserId
                            }, {
                                name: 1,
                                email: 1,
                                userImage: 1
                            });

                            if (userData) {
                                reviewData.customerDetails = userData;
                                ReviewArray.push(reviewData);
                                resolve();
                            } else {
                                reviewData.customerDetails = {};
                                ReviewArray.push(reviewData);
                                resolve();
                            }

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
                        message: "Get all review and rating.",
                        barberName:barberData.name,
                        data: ReviewArray,
                        reviewCount: totalCount,
                        ratingAvg: finalratingAvg,
                        // rating5P: rating5P + "%",
                        // rating4P: rating4P + "%",
                        // rating3P: rating3P + "%",
                        // rating2P: rating2P + "%",
                        // rating1P: rating1P + "%"
                        rating5P: rating5P ,
                        rating4P: rating4P ,
                        rating3P: rating3P ,
                        rating2P: rating2P ,
                        rating1P: rating1P 
                    })
                })
            }else{
                return reply({
                    status:false,
                    message:'No data found.',
                    data:[]
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
    path: '/user/getMyReviewAndRatingList',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all rating and review.',
        notes: [],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}