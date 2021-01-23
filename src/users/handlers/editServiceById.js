import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
import Services from '../../models/serviceDetails'
let defaults = {};

/**
Api to Edit profile. 
  **/

const handler = async (request, reply) => {
    try {
            // console.log("payload",request.payload);
        // const userId = await Helpers.extractUserId(request)
            const serviceId=_.get(request,'payload.serviceId','');
            // console.log(serviceId);
            const payload=request.payload;
            // const serviceCategoryId=_.get(payload,'serviceCategoryId','');
            // const email=_.get(payload,'email','');
            // const gender=_.get(payload,'gender','');
            // const serviceName=_.get(payload,'serviceName','');
            // const duration=_.get(payload,'duration','');
            // const price=_.get(payload,'price','');
            // const extraCharge=_.get(payload,'extraCharge','');
            // var data={
            //     serviceCategoryId:serviceCategoryId,
            //     email:email,
            //     gender:gender,
            //     serviceName:serviceName,
            //     duration:duration,
            //     price:price,
            //     extraCharge:extraCharge
            // }
             var ss=await Services.findOneAndUpdate({
                _id: serviceId
            }, {
                $set: payload
            }, {
                new: true
            })
             if(ss){
            return reply({
                status: true,
                message: 'Updated service',
                // data: user
            })    
        }else{
            return reply({
                status: false,
                message: 'Service id not valid.',
                // data: user
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
    path: '/user/editServiceById',
    config: {
        // auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Update Service.',
        notes: ['On success'],
        validate: {
            payload: {
                email:Joi.string().optional(),
                serviceCategoryId:Joi.string().optional(),
                serviceCategoryName:Joi.string().optional(),
                serviceId:Joi.string().optional(),
                gender: Joi.string().optional(),
                serviceName: Joi.string().optional(),
                duration: Joi.string().optional(),
                extraCharge: Joi.number().optional(),
                price: Joi.number().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}