import Hoek from 'hoek'

import Helpers from '../../helpers'
import Users from '../../models/users'
// import Location from '../../models/savedlocations'
import SubscriptionHistory from '../../models/userSubscriptionHistory'

let defaults = {}
/*
 * Here is the api for get login user record based on jwt token
 **/
const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: id
        },{myOpeningHoursArray:0}).populate('serviceTypeList');
        if (user) {
            const subscriptionData = await SubscriptionHistory.find({
                $and: [{
                    userId: id
                }, {
                    status: 1
                }]
            }).sort({createdAt:-1});
            // console.log(subscriptionData);
            // console.log(subscriptionData.length);
            if(subscriptionData.length>1){
            user.subsRemainingDays = subscriptionData[1].remainingDays;                
            user.subscriptionName = subscriptionData[1].planDisplayName;                
            user.subscriptionId = subscriptionData[1].subscriptionId;                
            user.subscriptionEndDate = subscriptionData[1].endDate;                
            }
            else{
            user.subscriptionId = subscriptionData[0].subscriptionId;                
            user.subsRemainingDays = subscriptionData[0].remainingDays;                
            user.subscriptionName = subscriptionData[0].planDisplayName;                
            user.subscriptionEndDate = subscriptionData[0].endDate; 
            }
            user.reviewCount=0;
            return reply({
                status: true,
                message: 'user fetched successfully',
                data: user ? user : {}
            })
        }

        // user.locations = await Location.find({ userId: id })

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
    path: '/user/me',
    config: {
        auth: 'jwt',
        tags: ['api', 'me'],
        description: 'Returns a user object based on JWT along with a new token.',
        notes: [],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}