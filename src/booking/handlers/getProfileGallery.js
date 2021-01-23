import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
import BarberUser from '../../models/users';
import FavouriteImage from '../../models/favouriteImage'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to Get Profile Gallery.
 **/

const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: id
        }).lean();
        if (user) {
            const payload = request.payload;
            const barberId = _.get(request, 'payload.barberId', '');
            const BarberImageData = await BarberUser.findOne({
                _id: barberId
            }, {
                images: 1
            });
            // console.log(BarberImageData);
            if (BarberImageData) {
                const images = BarberImageData.images;
                // console.log(images);
                if (images.length > 0) {
                    var imageArray = [];
                    for (var i = 0; i < images.length; i++) {
                        const imageId = images[i].id;
                        const data = await FavouriteImage.findOne({
                            $and: [{
                                userId: id
                            }, {
                                imageId: imageId
                            }]
                        });
                        if (data) {
                            images[i].isFavourite = data.isFavourite;

                        } else {
                            images[i].isFavourite = false;

                        }
                        const data1 = await FavouriteImage.count({
                            $and: [{
                                isFavourite: true
                            }, {
                                imageId: imageId
                            }]
                        });
                        if (data1) {
                            images[i].totalFavouriteCount = data1;

                        } else {
                            images[i].totalFavouriteCount = 0;

                        }
                        imageArray.push(images[i]);
                    }
                return reply({
                    status: true,
                    message: "Get profile images.",
                    data: imageArray
                })
                }else{
                    return reply({
                    status: false,
                    message: "No Data Found.",
                    data: []
                })
                }

                
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
    path: '/customerUser/getProfileGallery',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Get Profile Gallery.',
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