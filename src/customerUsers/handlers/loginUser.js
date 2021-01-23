import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'

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
        const GoogleID = _.get(payload, 'FBID', '');
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
            } else if (loginType == "FBID") {
                if (user.FBID == FBID) {
                    match = true;
                } else {
                    return reply({
                        status: false,
                        message: "Your FBID is incorrect"
                    })
                }
            } else {
                if (user.GoogleID == GoogleID) {
                    match = true;
                } else {
                    return reply({
                        status: false,
                        message: "Your GoogleID is incorrect"
                    })
                }
            }
            if (match) {
                // var serviceData=await Services.findOne({_id:user.serviceTypeList[0]});
                // // console.log(serviceData)
                // // if(serviceData){
                // // 	user.serviceTypeList.push(serviceData);
                // // }
                // await Users.findOne({email:email},{$set:{deviceType:deviceType,deviceToken:deviceToken}},{new : true})
                const userData = await Users.findOne({
                    email
                })
                const token = Helpers.createJwt(user);
                userData.token = token;
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
    path: '/customerUser/login',
    config: {
        tags: ['api', 'users'],
        description: 'Login Barber Customer Account.',
        notes: ['On success'],
        validate: {
            payload: {
                email: Joi.string().required(),
                password: Joi.string().optional(),
                loginType: Joi.string().required(),
                FBID: Joi.string().optional(),
                GoogleID: Joi.string().optional(),
                deviceToken:Joi.string().optional(),
                deviceType:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}