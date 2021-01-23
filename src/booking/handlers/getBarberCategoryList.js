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
            const query = [{
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    key: "location",
                    distanceField: 'distance',
                    maxDistance: 10000,
                    spherical: true,

                }
            }]
            const data = await BarberUser.aggregate(query);
            console.log(data);
            var categoryData = [];
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                const categoryArray = data[i].serviceCategoryId;
                for (var j = 0; j < categoryArray.length; j++) {
                    const ID = categoryArray[j];
                    const singleData = await ServiceCategory.findOne({
                        _id: ID
                    });
                    categoryData.push(singleData)
                }
                count++;
                if (data.length == count) {
                    return reply({
                        status: true,
                        message: 'Get Barber category list.',
                        data: categoryData
                    })
                }
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
    path: '/customerUser/getBarberCategoryList',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get all Barber category list.',
        notes: [],
        validate: {
            payload: {
                latitude: Joi.string().optional(),
                longitude: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}