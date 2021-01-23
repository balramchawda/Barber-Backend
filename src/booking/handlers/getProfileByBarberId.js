import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import ratingAndReview from '../../models/ratingAndReview'
import Favourite from '../../models/favourite'
import serviceCategory from '../../models/serviceCategory'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Get Profile Barber .
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {
            const payload = request.payload;
            const barberId = _.get(request, 'payload.barberId', '');
            const id = ObjectID(barberId);
            const data = await BarberUser.findOne({
                _id: barberId
            }, {
                password: 0,
                subsRemainingDays: 0,
                token: 0,
                subscriptionId: 0,
                deviceType: 0,
                deviceToken: 0,
                loginType: 0,
                FBID: 0
            }).populate('serviceTypeList').populate('serviceCategoryId');
            // console.log(data);
            var reviewData = await ratingAndReview.find({
                barberUserId: id
            });
            var length=data.serviceTypeList.length;
            var ddd=data.serviceTypeList;
            // console.log(ddd[0].gender)
            var serviceTypeListData=[];
            var categoryData=await serviceCategory.find({userType:data.userType});
            // console.log(categoryData[0].serviceCategoryName)
            // console.log(categoryData[0])
            // console.log(categoryData.length);
            if(categoryData.length>0){
            for(var j=0;j<categoryData.length;j++){
                // var id="categoryData[j]"
                // console.log()
                var datas={
                    categoryId:categoryData[j]._id,
                    categoryName:categoryData[j].serviceCategoryName,
                    dataArray:[]
                }
                serviceTypeListData.push(datas);
            for(var k=0;k<ddd.length;k++){
                    if(categoryData[j]._id==ddd[k].serviceCategoryId){
                           var data11=serviceTypeListData[j];
                            data11.dataArray.push(ddd[k])
                    }
            }
            }
                            
            }

            // var serviceTypeListData=[
                // {
                //     gender:"Male",
                //     dataArray:[]
                // },
                // {
                //     gender:"Female",
                //     dataArray:[]
                // },
                // {
                //     gender:"other",
                //     dataArray:[]
                // }
            // ];
            // for(var j=0;j<ddd.length;j++){
            //         if(ddd[j].gender=="male"||ddd[j].gender=="Male"){
            //             var data11=serviceTypeListData[0];
            //                 data11.dataArray.push(ddd[j])
            //         }else if(ddd[j].gender=="Female"||ddd[j].gender=="Female"){
            //                var data11=serviceTypeListData[1];
            //                 data11.dataArray.push(ddd[j])
            //         }else{
            //                 var data11=serviceTypeListData[2];
            //                 data11.dataArray.push(ddd[j])
            //         }
            // }
                data.serviceTypeList=serviceTypeListData;
                data.serviceTypeListData=serviceTypeListData;
            for (var i = 0; i < reviewData.length; i++) {
                data.ratingAndReviews.push(reviewData[i]);
            }

            var favouriteData = await Favourite.findOne({
                $and: [{
                    customerUserId: userId
                }, {
                    barberUserId: id
                }]
            });
            if (favouriteData) {
                data.isFavourite = favouriteData.isFavourite;
            } else {
                data.isFavourite = false;
            }
            var reviewCount = await ratingAndReview.count({
                barberUserId: id
            });
            if (reviewCount > 0) {
                const query = [{
                    $group: {
                        _id: "$data._id",
                        average: {
                            $avg: "$rating"
                        }
                    },
                }]
                var ratingAvg = await ratingAndReview.aggregate(query);
                if (ratingAvg.length > 0 || ratingAvg != '') {
                    // data.ratingAvg = ratingAvg[0].average;
                    var data1 = ratingAvg[0].average;
                    data.ratingAvg = (data1 | 0);

                } else {
                    ratingAvg = 0;
                }
                if (reviewCount != '') {
                    data.reviewCount = reviewCount;
                } else {
                    data.reviewCount = 0;
                }
            } else {
                data.reviewCount = 0;
                // console.log('ss');    
                data.ratingAvg = 0;
            }
            var imageCount=data.images;
            data.imageCount=imageCount.length;
            // data.mainId=userId
            return reply({
                status: true,
                message: 'Get profile.',
                data: data
            })
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
    path: '/customerUser/getBarberProfileById',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get Barber Profile.',
        notes: [],
        validate: {
            payload: {
                barberId: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}