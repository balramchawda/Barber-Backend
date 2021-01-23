import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import Favourite from '../../models/favourite'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to favourite or unfavourite.
 **/

const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: id
        }).lean();
        if (user) {
            const payload = request.payload;
            const isFavourite = _.get(request, 'payload.isFavourite', '');
            const barberId = _.get(request, 'payload.barberId', '');
            const data = await Favourite.findOne({
                $and: [{
                    customerUserId: id
                }, {
                    barberUserId: barberId
                }]
            });
            if (data) {
                var isFav = data.isFavourite;
                console.log(isFav);
                if (isFav == false) {
                    const dataObj = await Favourite.findOneAndUpdate({
                        $and: [{
                            customerUserId: id
                        }, {
                            barberUserId: barberId
                        }]
                    }, {
                        $set: {
                            isFavourite: true
                        }
                    }, {
                        new: true
                    });
                    // await dataObj.save();
                    return reply({
                        status: true,
                        message: 'Added favourite successfully.'
                    })
                } else if (isFav == true) {
                    const dataObj = await Favourite.findOneAndUpdate({
                        $and: [{
                            customerUserId: id
                        }, {
                            barberUserId: barberId
                        }]
                    }, {
                        $set: {
                            isFavourite: false
                        }
                    }, {
                        new: true
                    });
                    // await dataObj.save();
                    return reply({
                        status: true,
                        message: 'UnFavourite successfully.'
                    })
                }
            } else {
                const payloadData = {
                    customerUserId: id,
                    barberUserId: barberId,
                    isFavourite: isFavourite
                }
                const dataObj = await new Favourite(payloadData);
                await dataObj.save();
                return reply({
                    status: true,
                    message: 'Added favourite successfully.'
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
    path: '/customerUser/favouriteAndUnFavourite',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Favourite and Un Favourite.',
        notes: [],
        validate: {
            payload: {
                barberId: Joi.string().optional(),
                isFavourite: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}