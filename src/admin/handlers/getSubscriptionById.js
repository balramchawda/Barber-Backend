import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import SubscriptionPlan from '../../models/subscriptionPlan';
let defaults = {};
/**
Api to getSubscriptionPlans by id. 
  **/
const handler = async (request, reply) => {
    try {
        const payload=request.payload;
        const subscriptionId=_.get(request,"payload.subscriptionId",'');
        const SubscriptionPlanData=await SubscriptionPlan.findOne({_id:subscriptionId});    
        // console.log(BusinessTypeData);
        if(SubscriptionPlanData){
            return reply({
                status:true,
                message:"Get subscription plans.",
                data:SubscriptionPlanData
            })
        }else{
            return reply({
                status:false,
                message:"Not Data Found.",
                data:[]
            })
        }        
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
    path: '/admin/getSubscriptionById',
    config: {
        tags: ['api', 'users'],
        description: 'Get all subscription plans by id.',
        notes: ['On success'],
        validate: {
            payload: {
                subscriptionId: Joi.string().required(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}