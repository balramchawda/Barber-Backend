import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import FavouriteImage from '../../models/favouriteImage'
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
            const imageId = _.get(request, 'payload.imageId', '');
            const data = await FavouriteImage.findOne({
                $and: [{
                    userId: id
                }, {
                    imageId: imageId
                }]
            });
            if (data) {
                var isFav = data.isFavourite;
                // console.log(isFav);
                if (isFav == false) {
                    const dataObj = await FavouriteImage.findOneAndUpdate({
                        $and: [{
                            userId: id
                        }, {
                            imageId: imageId
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
                    const dataObj = await FavouriteImage.findOneAndUpdate({
                        $and: [{
                            userId: id
                        }, {
                            imageId: imageId
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
                    userId: id,
                    imageId: imageId,
                    isFavourite: isFavourite
                }
                const dataObj = await new FavouriteImage(payloadData);
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
    path: '/customerUser/favAndUnFavImage',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Favourite and un favourite image.',
        notes: [],
        validate: {
            payload: {
                imageId: Joi.string().optional(),
                isFavourite: Joi.boolean().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}