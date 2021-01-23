import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import SubscriptionPlan from '../../models/subscriptionPlan';
let defaults = {};
import AwsServices from '../../config/file_upload';
/**
Api to getServiceCategoryList. 
  **/
const handler = async (request, reply) => {
    try {
        const payload=request.payload;
        const days=_.get(payload,'days','');
        const price=_.get(payload,'price','');
        const planName=_.get(payload,'planName','');
        const planDisplayName=_.get(payload,'planDisplayName','');
        const userType=_.get(payload,'userType','');
        const data={planName:planName,planDisplayName:planDisplayName,userType:userType,days:days,price:price,status:true}
            const obj= await new SubscriptionPlan(data);
            await obj.save();
            return reply({
                status:true,
                message:"Added new subscription plan."
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
    path: '/admin/addSubscription',
    config: {
        tags: ['api', 'users'],
        description: 'Add new service category.',
        notes: ['On success'],
        validate:{
            payload:{
                planName:Joi.string().optional(),
                userType:Joi.string().optional(),
                days:Joi.string().optional(),
                price:Joi.string().optional(),
                planDisplayName:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}