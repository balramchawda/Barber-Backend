import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import ratingAndReview from '../../models/ratingAndReview'
import Favourite from '../../models/favourite'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Get all favourite Barber .
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {

            const FavouriteData = await Favourite.find({
                $and: [{
                    customerUserId: userId
                }, {
                    isFavourite: true
                }]
            });
            var address=user.address;
            if(address){
                var latitude=address.latitude
                var longitude=address.longitude;
            }
            if (FavouriteData.length > 0) {
                var favouriteBarberArray = [];
                FavouriteData.reduce(function(promiesRes, favouriteData, index) {
                    return promiesRes.then(function(data) {
                        return new Promise(async function(resolve, reject) {
                            const barberId = favouriteData.barberUserId;
                            // console.log(latitude)
                            // console.log(longitude)
                            // // var barberSingleData = await BarberUser.findOne({
                            //     _id: barberId
                            // }, {
                            //     _id: 1,
                            //     name: 1,
                            //     image: 1,
                            //     isOnline: 1,
                            //     specialOfferDeals: 1,
                            //     serviceTypeList: 1,
                            //     ratingAvg: 1,
                            //     isFavourite: 1,
                            //     reviewCount: 1,
                            //     ratingAndReviews: 1,
                            //     email: 1,
                            //     address: 1,
                            //     userType:1,
                            //     userImage:1,
                            //     aboutBusiness:1,


                            // }).populate('serviceTypeList');
                              
                              var query = [
                        {
                    $geoNear: {
                        // query:{"categoryId":"5ed647db3f55041b880e94b7"},
                        near: {
                            type: "Point",
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        },
                        key: "location",
                        distanceField: 'distance',
                        maxDistance: 13000000,
                        spherical: true,
                    }
                },
                {
                    $match: {
                        _id:ObjectID(barberId)  
                    }
                //     $match: {
                //         serviceCategoryId: {
                //             $in:[newValue]
                //         }
                // }
            },
                {
                    $lookup: {
                        from: "services",
                        localField: "serviceTypeList",
                        foreignField: "_id",
                        as: "serviceTypeList"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        address: 1,
                        name: 1,
                        serviceCategoryId:1,
                        userType: 1,
                        aboutBusiness: 1,
                        userImage:1,
                        isOnline: 1,
                        specialOfferDeals: 1,
                        ratingAvg: 1,
                        serviceTypeList: {
                            _id: 1,
                            serviceCategoryId:1, 
                            gender: 1,
                            serviceName: 1,
                            duration: 1,
                            price: 1,
                            extraCharge: 1,
                            isDoorService: 1,
                            userId: 1
                        },
                        images:1,
                        email: 1,
                        ratingAndReviews: 1,
                        distance: 1,
                        chatUserId:1,
                        createdAt: 1
                    }
                }
            ]
            var barberSingleData=await BarberUser.aggregate(query);
            // console.log(barberSingleData);
            var barberSingleData=barberSingleData[0];

                            var reviewData = await ratingAndReview.find({
                                barberUserId: barberId
                            });
                            if(reviewData.length>0){
                                for (var i = 0; i < reviewData.length; i++) {
                                
                                barberSingleData.ratingAndReviews.push(reviewData[i]);
                            }
                            }

                            barberSingleData.isFavourite = true;
                            var reviewCount = await ratingAndReview.count({
                                barberUserId: barberId
                            });
                            if (reviewCount > 0) {
                                const query = [{
                                    $group: {
                                        _id: "$barberSingleData._id",
                                        average: {
                                            $avg: "$rating"
                                        }
                                    },
                                }]
                                var ratingAvg = await ratingAndReview.aggregate(query);
                                if (ratingAvg.length > 0 || ratingAvg != '') {
                                    barberSingleData.ratingAvg = (ratingAvg[0].average|0);
                                } else {
                                    ratingAvg = 0;
                                }
                                if (reviewCount != '') {
                                    barberSingleData.reviewCount = reviewCount;
                                } else {
                                    barberSingleData.reviewCount = 0;
                                }
                            }else{
                                    barberSingleData.reviewCount = 0;
                                    barberSingleData.ratingAvg =0
                            }
            // console.log(barberSingleData);
                            var distance=barberSingleData.distance;
                            if(distance>0){
                                barberSingleData.distance=(distance/1000|0);
                            }else{
                                barberSingleData.distance=0
                            }
                            favouriteBarberArray.push(barberSingleData);
                            resolve();
                        })
                    }).catch(function(error) {
                        return reply({
                            status: false,
                            message: error.message
                        })
                    })
                }, Promise.resolve(null)).then(arrayOfResults => {
                    return reply({
                        status: true,
                        message: "Get all favourite barber",
                        data: favouriteBarberArray
                    })
                });
            } else {
                return reply({
                    status: false,
                    message: "No data found",
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
    path: '/customerUser/getFavouriteBarberList',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all favourite Barber.',
        notes: [],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}