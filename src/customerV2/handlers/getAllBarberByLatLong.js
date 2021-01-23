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
 * Api to Get all Barber via lat,long and serviceId.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {
            const payload = request.payload;
            console.log(payload)
            const serviceId = _.get(request, 'payload.serviceId', '');
            const latitude = _.get(request, 'payload.latitude', '');
            const longitude = _.get(request, 'payload.longitude', '');
            var serviceIdArray=[];
            for(var i=0;i<serviceId.length;i++){
                var newValue=ObjectID(serviceId[i])
                serviceIdArray.push(newValue);
            }
            console.log(serviceIdArray)
            // const newValue = ObjectID("5f0879ed83961532e2fd058f")
            // const newValue1=ObjectID("5f072f220e33e2796f957c53");
            if(latitude!='' && longitude!=''){
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
                        maxDistance: 13000000000,
                        spherical: true,
                    }
                },
                {
                    $match: {
                        serviceTypeList: {
                            $elemMatch:{$in:serviceIdArray}
                        }
                    }
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
                        // _id: 1,
                        // address: 1,
                        // name: 1,
                        // userType: 1,
                        // aboutBusiness: 1,
                        // isOnline: 1,
                        // specialOfferDeals: 1,
                        // ratingAvg: 1,
                        // serviceTypeList: {
                        //     _id: 1,
                        //     gender: 1,
                        //     serviceName: 1,
                        //     duration: 1,
                        //     price: 1,
                        //     extraCharge: 1,
                        //     isDoorService: 1,
                        //     userId: 1
                        // },
                        // email: 1,
                        // ratingAndReview: 1,
                        // distance: 1,
                        // createdAt: 1
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
            //             serviceTypeList:{
            //                 $filter: {
            //    input: "$serviceTypeList",
            //    as: "item",
            //    cond: { $in: ['$$item._id:' ,[serviceIdArray]] } 
            // }
            //             },
                        images:1,
                        email: 1,
                        ratingAndReview: 1,
                        distance: 1,
                        chatUserId:1,
                        createdAt: 1
                    }
                }
            ]    
        }else{
            var query = [
                {
                    $match: {
                        serviceTypeList: {
                            $in:serviceIdArray
                        }
                    }
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
                        // _id: 1,
                        // address: 1,
                        // name: 1,
                        // userType: 1,
                        // aboutBusiness: 1,
                        // isOnline: 1,
                        // specialOfferDeals: 1,
                        // ratingAvg: 1,
                        // serviceTypeList: {
                        //     _id: 1,
                        //     gender: 1,
                        //     serviceName: 1,
                        //     duration: 1,
                        //     price: 1,
                        //     extraCharge: 1,
                        //     isDoorService: 1,
                        //     userId: 1
                        // },
                        // email: 1,
                        // userImage:1,
                        // ratingAndReview: 1,
                        // distance: 1,
                        // createdAt: 1
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
                        email:1,
                        ratingAndReview: 1,
                        distance: 1,
                        chatUserId:1,
                        createdAt: 1
                    }
                }
            ]
        }
            
            const data = await BarberUser.aggregate(query);
            for (var i = 0; i < data.length; i++) {
                var id = data[i]._id;

                var reviewData = await ratingAndReview.find({
                    barberUserId: id
                });
                // data[i].ratingAndReview.push(reviewData);
                data[i].ratingAndReviews = reviewData;
                var favouriteData = await Favourite.findOne({
                    $and: [{
                        customerUserId: userId
                    }, {
                        barberUserId: id
                    }]
                })
                if (favouriteData) {
                    data[i].isFavourite = favouriteData.isFavourite;
                } else {
                    data[i].isFavourite = false;
                }
                var reviewCount = await ratingAndReview.count({
                    barberUserId: data[i]._id
                });
                if (reviewCount > 0) {
                    const query = [
                        {
                            $group: {
                                _id: "$data[i]._id",
                                average: {
                                    $avg: "$rating"
                                }
                            },
                        }
                    ]
                    var ratingAvg = await ratingAndReview.aggregate(query);
                    if (ratingAvg.length > 0 || ratingAvg != '') {
                        var finalratingAvg = (ratingAvg[0].average|0);
                // console.log(finalratingAvg);
                // if(finalratingAvg){
                //     var finalratingAvg=finalratingAvg
                // }else{
                //     var finalratingAvg=0.0
                // }
                        // data[i].ratingAvg = ratingAvg[0].average;
                        data[i].ratingAvg = (ratingAvg[0].average|0);
                    } else {
                        ratingAvg = 0.0;
                    }
                }else{
                        data[i].ratingAvg = 0;
                }
                data[i].reviewCount = reviewCount;
                var distance= data[i].distance;
                if(distance<=0){
                    data[i].distance=distance;
                }else{
                var distance1=(distance/1000|0);
                data[i].distance=distance1;    
                }
            }
            if(data.length>0){
            return reply({
                status: true,
                message: 'Get Barber list .',
                data: data
            })                
            }else{
            return reply({
                status: false,
                message: 'No data found.',
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
    path: '/customerv2/getAllBarberList',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all Barber.',
        notes: [],
        validate: {
            payload: {
                latitude: Joi.string().optional(),
                longitude: Joi.string().optional(),
                type:Joi.string().optional(),
                isNearBy:Joi.boolean().optional(),
                serviceId:Joi.array().optional(),
                atHome:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}