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
        const userType=_.get(request,"payload.userType",'');
            // const data={planName:"Free",currencyType:"$",price:"00.00",days:"30",userType:"individual",status:"1"}
            // const data={planName:"Paid",currencyType:"$",price:"30.00",days:"90",userType:"business",status:"1"}
            // const data={planName:"Free",currencyType:"$",price:"00.00",days:"30",userType:"individual",status:"1"}
            // const obj= await new SubscriptionPlan(data);
            // await obj.save();
        const SubscriptionPlanData=await SubscriptionPlan.find({userType});    
        // console.log(BusinessTypeData);
        var subscriptionArray=[];
        if(SubscriptionPlanData.length > 0){
                    for (var i=0;i<SubscriptionPlanData.length;i++){
                            if(SubscriptionPlanData[i].planName=="free"||SubscriptionPlanData[i].planName=="Free"){
                                        SubscriptionPlanData.splice(i,1);
                            }else{
                                 // subscriptionArray.push(SubscriptionPlanData[i]);   
                            }
                    }
            return reply({
                status:true,
                message:"Get all subscription plans.",
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
    path: '/admin/getAllSubscriptionAccount',
    config: {
        tags: ['api', 'users'],
        description: 'Get all subscription plans.',
        notes: ['On success'],
        validate: {
            payload: {
                userType: Joi.string().required(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}