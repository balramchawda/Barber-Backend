import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users'
import ratingAndReview from '../../models/ratingAndReview'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
import ServiceCategory from '../../models/serviceCategory';
let defaults = {}

/*
 * Api to Get all Barber category list via lat,long and catId.
 **/

const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: id
        }).lean();
        if (user) {
            const payload = request.payload;
            const latitude = _.get(request, 'payload.latitude', '');
            const longitude = _.get(request, 'payload.longitude', '');
            const barberId=_.get(request,'payload.barberId','');
            const newValue=ObjectID(barberId);
            const query = [{
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    key: "liveLocation",
                    distanceField: 'distance',
                    maxDistance: 10000,
                    spherical: true,

                }
            },{
                $match:{
                    _id:{$eq:newValue}
                }
            },
            {
                $project:{
                    barberLiveLatitude:1,
                    barberLiveLongitude:1,
                    distance:1
                }
            }]
            const data = await BarberUser.aggregate(query);
            // console.log(data)
            if(data.length>0){
                return reply({
                    status:true,
                    message:"Live lat long.",
                    data:data[0]
                })
            }else{
                return reply({
                    status:false,
                    message:"No data found."
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
    path: '/customerv2/trackMe',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all Barber category list.',
        notes: [],
        validate: {
            payload: {
                latitude: Joi.string().optional(),
                longitude: Joi.string().optional(),
                barberId:Joi.string().optional(),
                bookingId:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}