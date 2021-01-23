import Hoek from 'hoek'
import Joi from 'joi'

import Helpers from '../../helpers'
import Users from '../../models/users'
// import Location from '../../models/savedlocations'
import SubscriptionHistory from '../../models/userSubscriptionHistory'
import AwsServices from '../../config/file_upload';
let defaults = {}
/*
 * Here is the api for get login user record based on jwt token
 **/
const handler = async (request, reply) => {
    try {
        var payload = request.payload;
        // console.log(payload);
        if (payload.images) {
            var file = payload.images;
            let encoded = file.toString().replace(/^data:(.*,)?/, "");
            if (encoded.length % 4 > 0) {
                encoded += "=".repeat(4 - (encoded.length % 4));
            }
            var buf = new Buffer(file, 'base64');
            // console.log(buf);
            const imageUrl = await AwsServices.upload("workPlace.png", buf);
            return reply({
                status: true,
                message: "Uploaded image successfully.",
                imageUrl: imageUrl,
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
    path: '/user/uploadFile',
    config: {
        tags: ['api', 'me'],
        description: 'Returns a user object based on JWT along with a new token.',
        notes: [],
        validate: {
            payload: {
                images: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}