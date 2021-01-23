import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Services from '../../models/serviceDetails.js';
import SubscriptionHistory from '../../models/userSubscriptionHistory'

/** 
Api to Login user
**/

let defaults = {}
const handler = async (request, reply) => {
    try {
        let payload = request.payload;
        const email = _.get(payload, 'email', "");
        const password = _.get(payload, 'password', "");
        const FBID = _.get(payload, 'FBID', '');
        const deviceToken = _.get(payload, 'deviceToken', '');
        const deviceType = _.get(payload, 'deviceType', '');
        const user = await Users.findOne({
            email
        })
        if (user) {
            if(user.status){
            const loginType = _.get(payload, 'loginType', '');
            let match;
            if (loginType == "Normal") {
                match = Helpers.matchPassword(password, user.password);
            } else {
                if (user.FBID == FBID) {
                    match = true;
                } else {
                    return reply({
                        status: false,
                        message: "Your FBID is incorrect"
                    })
                }
            }
            if (match) {
                const userData = await Users.findOne({
                    email
                },{myOpeningHoursArray:0}).populate('serviceTypeList');
                const token = Helpers.createJwt(user);
                userData.token = token;
                const subscriptionData = await SubscriptionHistory.find({
                $and: [{
                    userId: user._id
                }, {
                    status: 1
                }]   
            }).sort({createdAt:-1});
            if(subscriptionData.length>1){
                // console.log('enter')
            userData.subsRemainingDays = subscriptionData[1].remainingDays;                
            userData.subscriptionName = subscriptionData[1].planDisplayName;                
            userData.subscriptionId = subscriptionData[1].subscriptionId;                
            userData.subscriptionEndDate = subscriptionData[1].endDate;                
            }
            else{
            userData.subscriptionId = subscriptionData[0].subscriptionId;                
            userData.subsRemainingDays = subscriptionData[0].remainingDays;                
            userData.subscriptionName = subscriptionData[0].planDisplayName;                
            userData.subscriptionEndDate = subscriptionData[0].endDate; 
            }
                // console.log(userData.reviewCount)
                userData.reviewCount=0;
                // console.log(userData.reviewCount)
                // if(payload.deviceToken){

                // }else{
                //     payload.deviceToken=""
                //     payload.deviceType=""                    
                // }
            await Users.findOneAndUpdate({email:email},{$set:{deviceType:deviceType,deviceToken:deviceToken}},{new:true});  
                return reply({
                    status: true,
                    message: "Login successfully",
                    data: userData
                })
            } else {
                return reply({
                    status: false,
                    message: "Your password is incorrect."
                })
            }
        }else{
            return reply({
                status:false,
                message:"Your account has been blocked by admin."
            })
        }
        } else {
            return reply({
                status: false,
                message: "Your email is not registered."
            })
        }
    } catch (error) {
        return reply({
            status: false,
            message: error.message
        })
    }
}


const routeConfig = {
    method: 'POST',
    path: '/user/login',
    config: {
        tags: ['api', 'users'],
        description: 'Login Barber Business Account.',
        notes: ['On success'],
        validate: {
            payload: {
                email: Joi.string().required(),
                password: Joi.string().optional(),
                loginType: Joi.string().required(),
                FBID: Joi.string().optional(),
                deviceType:Joi.string().optional(),
                deviceToken:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}