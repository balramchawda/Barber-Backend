import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Services from '../../models/serviceDetails.js';
import SubscriptionHistory from '../../models/userSubscriptionHistory'
import CustomerUsers from '../../models/customerUser';
import Admin from '../../models/admin';


/** 
Api to Login user
**/

let defaults = {}
const handler = async (request, reply) => {
    try {
        let payload = request.payload;
        console.log(payload);
        const email = _.get(payload, 'email', "");
        const password = _.get(payload, 'password', "");
        const role=_.get(payload,'role','');
        if(role=="BARBER"){
        const user = await Users.findOne({
            email
        })
        if (user) {
            let match=Helpers.matchPassword(password, user.password);
            
            if (match) {
                const userData = await Users.findOne({
                    email
                }).populate('serviceTypeList');
                const token = Helpers.createJwt(user);
                userData.token = token;
                const subscriptionData = await SubscriptionHistory.findOne({
                    $and: [{
                        userId: user._id
                    }, {
                        status: 1
                    }]
                });
                userData.subsRemainingDays = subscriptionData.remainingDays;    
            
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
        } else {
            return reply({
                status: false,
                message: "Your email is not registered."
            })
        }
        }else if(role=="USER"){
                const user = await CustomerUsers.findOne({
                    email
                })
        if (user){
            let match= Helpers.matchPassword(password, user.password);
            if(match) {
                const userData=await CustomerUsers.findOne({email})
                const token = Helpers.createJwt(user);
                userData.token=token;
                return reply({
                    status: true,
                    message: "Login successfully",
                    data: userData
                })
            
            } else {
                return reply({
                    status: false,
                    message: "Your password is incorrect"
                })
            }
        } else {
            return reply({
                status: false,
                message: "Your email is not registered."
            })
        }
            }else{
                const user = await Admin.findOne({
                    email
                })
        if (user){
            // let match= Helpers.matchPassword(password, user.password);
            if(user.password==password) {
                const userData=await Admin.findOne({email})
                const token = Helpers.createJwt(user);
                userData.token=token;
                userData.role="ADMIN"
                return reply({
                    status: true,
                    message: "Login successfully",
                    data: userData
                })
            
            } else {
                return reply({
                    status: false,
                    message: "Your password is incorrect"
                })
            }
        } else {
            return reply({
                status: false,
                message: "Your email is not registered."
            })
        }       
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
    path: '/admin/login',
    config: {
        tags: ['api', 'users'],
        description: 'Login Barber Account.',
        notes: ['On success'],
        validate: {
            payload: {
                email: Joi.string().required(),
                password: Joi.string().optional(),
                role:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}