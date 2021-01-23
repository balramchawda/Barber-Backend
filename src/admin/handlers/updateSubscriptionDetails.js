import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import SubscriptionPlan from '../../models/subscriptionPlan';
let defaults = {};
/**
Api to getSubscriptionPlans. 
  **/
const handler = async (request, reply) => {
    try {
        const payload=request.payload;
        const subscriptionId=_.get(request,"payload.subscriptionId",'');
        const planName=_.get(request,"payload.planName",'');
        const days=_.get(request,'payload.days','');
        const price=_.get(request,'payload.price','');
        const userType=_.get(request,'payload.userType','');
        const planDisplayName=_.get(request,'payload.planDisplayName','');
       // console.log(payload);

        const data={
            planName:planName,
            days:days,
            price:price,
            userType:userType,
            planDisplayName:planDisplayName
        }

        const SubscriptionPlanData=await SubscriptionPlan.findOneAndUpdate({_id:subscriptionId},{$set:data},{new:true});    
        // console.log(BusinessTypeData);
        // const SubscriptionPlanData=await SubscriptionPlan.findOne({_id:subscriptionId});    
        
        if(SubscriptionPlanData){
            return reply({
                status:true,
                message:"Updated successfully.",
                // data:SubscriptionPlanData
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
    path: '/admin/updateSubscriptionDetails',
    config: {
        tags: ['api', 'users'],
        description: 'Get all subscription plans.',
        notes: ['On success'],
        validate: {
            payload: {
                subscriptionId: Joi.string().required(),
                planName:Joi.string().optional(),
                days:Joi.string().optional(),
                price:Joi.string().optional(),
                userType:Joi.string().optional(),
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