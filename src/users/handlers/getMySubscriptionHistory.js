import Hoek from 'hoek'
import Helpers from '../../helpers'
import Users from '../../models/users'
import SubscriptionHistory from '../../models/userSubscriptionHistory'

let defaults = {}
/*
 * API to getAllMySubscription
 **/
const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        const user = await Users.find({
            _id: id
        }).lean();
        if (user) {
            const subscriptionData = await SubscriptionHistory.find({
                userId: id
            })
            return reply({
                status: true,
                message: 'Get all subscriptions.',
                data: subscriptionData ? subscriptionData : {}
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
    method: 'GET',
    path: '/user/getMySubscriptionList',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Returns a subscription list object based on JWT along with a new token.',
        notes: [],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}