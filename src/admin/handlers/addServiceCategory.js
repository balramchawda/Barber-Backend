import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import ServiceCategory from '../../models/serviceCategory';
let defaults = {};
import AwsServices from '../../config/file_upload';
/**
Api to getServiceCategoryList. 
  **/
const handler = async (request, reply) => {
    try {
        const payload = request.payload;
        var fileData = payload.image;
        // console.log(fileData)
        if (fileData != 0) {
            var buf = new Buffer(fileData.base64Code, 'base64');
            var imageUrl = await AwsServices.upload(fileData.filename, buf);
            // console.log(imageUrl);
        }
        const categoryName = _.get(payload, 'categoryName', '');
        const userType = _.get(payload, 'userType', '');
        const data = {
            serviceCategoryName: categoryName,
            userType: userType,
            imageUrl: imageUrl,
            status: true
        }
        const obj = await new ServiceCategory(data);
        await obj.save();
        return reply({
            status: true,
            message: "Added new service category."
        })
    } catch (error) {
        console.log(error.message);
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'POST',
    path: '/admin/addCategory',
    config: {
        tags: ['api', 'users'],
        description: 'Add new service category.',
        notes: ['On success'],
        validate: {
            payload: {
                categoryName: Joi.string().optional(),
                userType: Joi.string().optional(),
                image: Joi.any().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}