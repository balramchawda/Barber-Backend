import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import SubscriptionHistory from '../../models/userSubscriptionHistory';
import subscriptionPlan from '../../models/subscriptionPlan'
let defaults = {};
/**
Api to getSubscriptionPlans. 
  **/
const handler = async (request, reply) => {
    try {
        const userId = await Helpers.extractUserId(request);
        const SubscriptionPlanData = await SubscriptionHistory.find({
            $and: [{
                userId: userId
            }, {
                status: 1
            }]
        }).sort({
            createdAt: -1
        });
        // console.log(SubscriptionPlanData);
        var subscriptionArray = [];
        if (SubscriptionPlanData.length > 1) {
            var data = await subscriptionPlan.findOne({
                _id: SubscriptionPlanData[1].subscriptionId
            }, {
                planDisplayName: 1
            });
            if (data) {
                SubscriptionPlanData[1].planDisplayName = data.planDisplayName;
            } else {
                SubscriptionPlanData[1].planDisplayName = "";
            }
            SubscriptionPlanData[1].runningStatus = "running";
            SubscriptionPlanData[0].runningStatus = "upcomming";
            var data = await subscriptionPlan.findOne({
                _id: SubscriptionPlanData[0].subscriptionId
            }, {
                planDisplayName: 1
            });
            if (data) {
                SubscriptionPlanData[0].planDisplayName = data.planDisplayName;
            } else {
                SubscriptionPlanData[0].planDisplayName = "";
            }
            var data1 = {
                running: '',
                upcomming: ''
            }
            data1.running = SubscriptionPlanData[1]
            data1.upcomming = SubscriptionPlanData[0]

            return reply({
                status: true,
                message: "Get current subscription plans history.",
                data: SubscriptionPlanData
            })
        } else {
            // console.log('enter')
            if (SubscriptionPlanData.length > 0) {
                var data = await subscriptionPlan.findOne({
                    _id: SubscriptionPlanData[0].subscriptionId
                }, {
                    planDisplayName: 1
                });
                if (data) {
                    SubscriptionPlanData[0].planDisplayName = data.planDisplayName;
                } else {
                    SubscriptionPlanData[0].planDisplayName = "";
                }
                var data1={
                    running:''
                }
                data1.running = SubscriptionPlanData[0]
                return reply({
                    status: true,
                    message: "Get current subscription plans history.",
                    data: SubscriptionPlanData
                })
            } else {
                return reply({
                    status: false,
                    message: "No data found."
                })
            

        }
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
    method: 'GET',
    path: '/user/getMyCurrentSubscriptionPlan',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Get all subscription plans.',
        notes: ['On success'],
        // validate: {
        //     payload: {
        //         userType: Joi.string().required(),
        //     }
        // },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}