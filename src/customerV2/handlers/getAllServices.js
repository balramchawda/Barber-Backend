import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import ratingAndReview from '../../models/ratingAndReview'
import Service from '../../models/serviceDetails'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to all services.
 **/

const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {
            const payload = request.payload;
            const type = _.get(request, 'payload.type', '');
            const userType = "individual";
            const BarberData = await BarberUser.find({userType:userType});
            // console.log(BarberData.length);
            
            if (BarberData.length > 0) {
                var ServiceArray = [];
                // BarberData.reduce(function(promiseRes, barberData, index) {
                //     return promiseRes.then(function(data) {
                //         return new Promise(async function(resolve, reject) {
                            // console.log("barberData",barberData)
                           var count=0;
                            for(var j=0;j<BarberData.length;j++){
                            var serviceIds = BarberData[j].serviceTypeList;
                             // console.log("serviceIds",serviceIds);
                            for (var i = 0; i < serviceIds.length; i++) {
                                // console.log("serviceArray",serviceArray);
                                const serviceData = await Service.findOne({
                                    $and: [{
                                        _id: ObjectID(serviceIds[i])
                                    }, {
                                        gender: type
                                    }]
                                });
                                // console.log(serviceData);
                                if (serviceData) {
                                    // console.log("serviceArray",ServiceArray)
                                    ServiceArray.push(serviceData);
                                    // resolve();
                                } else {
                                    // resolve();
                                }   
                            }
                            count++;
                            if(count==BarberData.length){
                                return reply({
                                status: true,
                                message: 'Get all services list .',
                                data: ServiceArray
                            })         
                            } 
                            }
                               
                //         }).catch(function(error) {
                //             return reply({
                //                 status: false,
                //                 message: error.message
                //             })
                //         })
                //     })
                // }, Promise.resolve(null)).then(arrayOfResults => {
                //     return reply({
                //         status: true,
                //         message: 'Get all services list .',
                //         data: ServiceArray
                //     })
                // })
            }else{
                return reply({
                    status:false,
                    message:"No Data Found.",
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
    method: 'POST',
    path: '/customerv2/getAllServices',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all Services.',
        notes: [],
        validate: {
            payload: {
                type: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}