import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import ServiceDetails from '../../models/serviceDetails'
import TempServices from '../../models/storeTemporyServices'
import _ from 'lodash'
import {
    ObjectID
} from 'mongodb';
let defaults = {}

/*
 * Api to add new service.
 **/

const handler = async (request, reply) => {
    try {
        // const id = await Helpers.extractUserId(request)
        // const user = await Users.findOne({
        //   _id: id
        // })
        const email = _.get(request,'payload.email','');
        const tempServices = await TempServices.findOne({
            email:email
        }).lean();
        if (tempServices) {
            const payload = request.payload;
            var serviceCategoryId = _.get(request, 'payload.serviceCategoryId', '');
            if (serviceCategoryId) {
                payload.serviceCategoryId = ObjectID(serviceCategoryId);
            }
            // const userId = id;
            payload.email = email;
            const obj = await new ServiceDetails(payload);
            const data = await obj.save();
            if (data) {
                const serviceId = obj._id;
                const tempServiceData = await TempServices.findOne({
                    email: email
                })
                tempServiceData.serviceIds.push(serviceId);
                await tempServiceData.save();
                const user = await Users.findOne({
                        email:email
                    })
                if(user){
                     user.serviceTypeList.push(serviceId);
                user.serviceCategoryId.push(payload.serviceCategoryId);
                await user.save();     
                }else{
                    return reply({
                        status:false,
                        message:"Please use valid email."
                    })
                }
               
            }
            return reply({
                status: true,
                message: 'Added new service successfully.',
                // data: user ? user : {}
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
    path: '/user/addNewServiceAccount',
    config: {
        tags: ['api', 'me'],
        description: 'Add new service.',
        notes: [],
        validate: {
            payload: {
                email:Joi.string().required(),
                serviceCategoryId: Joi.string().optional(),
                serviceCategoryName: Joi.string().optional(),
                gender: Joi.string().optional(),
                serviceName: Joi.string().optional(),
                duration: Joi.string().optional(),
                price: Joi.number().optional(),
                extraCharge: Joi.number().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}