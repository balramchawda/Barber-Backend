import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import SubscriptionPlan from '../../models/subscriptionPlan';
let defaults = {};
/**
Api to updateSubscription status. 
  **/
const handler = async (request, reply) => {
    try {
        const subscriptionId = _.get(request, 'payload.subscriptionId', '');
        const subscriptionData = await SubscriptionPlan.findOne({
            _id: subscriptionId
        })
        if (subscriptionData) {
            var status = subscriptionData.status;
            if (status) {
                await SubscriptionPlan.findOneAndUpdate({
                    _id: subscriptionId
                }, {
                    $set: {
                        status: false
                    }
                }, {
                    new: true
                })
            } else {
                await SubscriptionPlan.findOneAndUpdate({
                    _id: subscriptionId
                }, {
                    $set: {
                        status: true
                    }
                }, {
                    new: true
                })
            }
            return reply({
                status: true,
                message: 'Category status updated successfully.'
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
    path: '/admin/updateSubscriptionStatus',
    config: {
        tags: ['api', 'users'],
        description: 'Update subscription status.',
        notes: ['On success'],
        validate: {
            payload: {
                subscriptionId: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}