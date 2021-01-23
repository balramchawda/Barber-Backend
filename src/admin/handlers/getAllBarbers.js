import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import User from '../../models/users';
import ratingAndReview from '../../models/ratingAndReview'

let defaults = {};
/**
Api to GetAllBarber. 
  **/
const handler = async (request, reply) => {
    try {
        const payload = request.payload;
        var perPage = 10;
        var sort = {};
        var search_data = _.get(request, 'payload.search_data', '');
        // console.log("search_data",search_data);
        if (search_data != "" || search_data != undefined) {
            // console.log('enter1');
            var searchData = search_data
            var page = payload.page || 1;
            // User.find(s_data).where(where).sort(sort).skip((perPage * page) - perPage)
            User.find({
                    "name": {
                        "$regex": search_data,
                        "$options": "i"
                    }
                }).skip((perPage * page) - perPage).populate('serviceTypeList')
                .sort({
                    createdAt: -1
                })
                .exec(function(err, users) {
                    //users = JSON.parse(JSON.stringify(users))
                    User.countDocuments({
                        "name": {
                            "$regex": search_data,
                            "$options": "i"
                        }
                    }).exec(async function(err, count) {
                        if (err) return console.log(err)
                        // console.log(users.length);
                        if (users) {
                            var DataArray = [];
                            users.reduce(function(promiseRes, users, index) {
                                return promiseRes.then(function(data) {
                                    return new Promise(async function(resolve, reject) {
                                        // var newUserId=ObjectID(earningData.userId);
                                        var reviewCount = await ratingAndReview.countDocuments({
                                            barberUserId: users._id
                                        });
                                        var serviceName = '';
                                        var serviceTypeLength = users.serviceTypeList;
                                        for (var i = 0; i < serviceTypeLength.length; i++) {
                                            // console.log(serviceTypeLength.length)
                                            if (serviceTypeLength.length > 1) {
                                                serviceName.concat(serviceTypeLength[i].serviceCategoryName + '/');
                                            }
                                            serviceName.concat(serviceTypeLength[i].serviceCategoryName)
                                        }
                                        users.serviceName = serviceName;
                                        // console.log(users.serviceName);
                                        if (reviewCount > 0) {
                                            const query = [{
                                                $group: {
                                                    _id: "$users._id",
                                                    average: {
                                                        $avg: "$rating"
                                                    }
                                                },
                                            }]
                                            var ratingAvg = await ratingAndReview.aggregate(query);
                                            // console.log(ratingAvg);
                                            if (ratingAvg.length > 0 || ratingAvg != '') {
                                                users.ratingAvg = ratingAvg[0].average;
                                            } else {
                                                users.ratingAvg = 0.0;
                                            }
                                        }
                                        DataArray.push(users);
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
                                    users: DataArray,
                                    currentPage: page,
                                    pageCount: Math.ceil(count / perPage)
                                })
                            })
                        }
                    })
                })
        } else {
            // console.log('enter2');

            var page = payload.page || 1;
            // User.find(s_data).where(where).sort(sort).skip((perPage * page) - perPage)
            User.find({}).skip((perPage * page) - perPage)
                .sort({
                    createdAt: -1
                })
                .exec(function(err, users) {
                    User.countDocuments({}).exec(function(err, count) {
                        if (err) return console.log(err)
                        if (users) {
                            var DataArray = [];
                            users.reduce(function(promiseRes, users, index) {
                                return promiseRes.then(function(data) {
                                    return new Promise(async function(resolve, reject) {
                                        // var newUserId=ObjectID(earningData.userId);
                                        var reviewCount = await ratingAndReview.countDocuments({
                                            barberUserId: users._id
                                        });
                                        var serviceName = '';
                                        var serviceTypeLength = users.serviceTypeList;
                                        for (var i = 0; i < serviceTypeLength.length; i++) {
                                            // console.log(serviceTypeLength.length)
                                            if (serviceTypeLength.length > 1) {
                                                serviceName.concat(serviceTypeLength[i].serviceCategoryName + '/');
                                            }
                                            serviceName.concat(serviceTypeLength[i].serviceCategoryName)
                                        }
                                        // console.log(serviceName)
                                        users.serviceName = serviceName;
                                        // console.log(users.serviceName);
                                        if (reviewCount > 0) {
                                            const query = [{
                                                $group: {
                                                    _id: "$users._id",
                                                    average: {
                                                        $avg: "$rating"
                                                    }
                                                },
                                            }]
                                            var ratingAvg = await ratingAndReview.aggregate(query);
                                            // console.log(ratingAvg);
                                            if (ratingAvg.length > 0 || ratingAvg != '') {
                                                users.ratingAvg = ratingAvg[0].average;
                                            } else {
                                                users.ratingAvg = 0.0;
                                            }
                                        }
                                        DataArray.push(users);
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
                                    users: DataArray,
                                    currentPage: page,
                                    pageCount: Math.ceil(count / perPage)
                                })
                            })
                        }
                    })
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
    path: '/admin/getAllBarbers',
    config: {
        tags: ['api', 'users'],
        description: 'Get all admin data.',
        notes: ['On success'],
        validate: {
            payload: {
                search_data: Joi.string().optional(),
                page: Joi.number().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}