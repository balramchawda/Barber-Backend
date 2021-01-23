import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Services from '../../models/serviceDetails'
import SubscriptionHistory from '../../models/userSubscriptionHistory'
import SubscriptionPlan from '../../models/subscriptionPlan'
// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()
import AwsServices from '../../config/file_upload';
const uniqid = require('uniqid');

/*
 * Api to create new user
 **/

let defaults = {}

const handler = async (request, reply) => {
    // const email = _.get(request, 'payload.email', '')
    try {
        let payload = request.payload
        console.log(payload, 'payload======>');
        const email = _.get(request, 'payload.email', '');
        const password = _.get(request, 'payload.password', '');
        const user = await Users.findOne({
            email
        })
        if (!user) {
            let hashPassword;
            if (password) {
                hashPassword = Helpers.hashPassword(password);
            } else {
                hashPassword = "";
            }
            const userType = _.get(request, 'payload.userType', '');
            const aboutBusiness = _.get(request, 'payload.aboutBusiness', '');
            // const specialOfferDeals = _.get(request, 'payload.specialOfferDeals', '');
            const serviceCategoryId = _.get(request, 'payload.serviceCategoryId','');
            const name = _.get(request, 'payload.name', '');
            const businessTypeList = _.get(request, 'payload.businessTypeList', '');
            const phone = _.get(request, 'payload.phone', '');
            const openingHours = _.get(request, 'payload.openingHours', '');
            const address = _.get(request, 'payload.address', '');
            const city = _.get(request, 'payload.city', '');
            const state = _.get(request, 'payload.state', '');
            const newAddress={
                streetAddress:address,
                city:city,
                state:state
            }
            // const deviceToken = _.get(request, 'payload.deviceToken', '');
            // const deviceType = _.get(request, 'payload.deviceType', '');
            // const loginType = _.get(request, 'payload.loginType', '');
            // const latitude = _.get(payload,"address.latitude",'');
            // const longitude =_.get(payload,"address.longitude",'');
            // // const location={
            //     type:"Point",
            //     coordinates:[]
            // }
            // location.coordinates.push(parseFloat(longitude));
            // location.coordinates.push(parseFloat(latitude));
            // const FBID = _.get(request, 'payload.FBID', '');
            var businessTypeListArray=[];
            for(var i=0;i<businessTypeList.length;i++){
                businessTypeListArray.push(businessTypeList[i]);
            }
            var openingHoursArray=[];
            for(var i=0;i<openingHours.length;i++){
                openingHoursArray.push(openingHours[i]);
            }
            const userPayload = {
                name: name, 
                email: email,
                password: hashPassword,
                phone:phone,
                address: newAddress,
                userType: userType,
                aboutBusiness: aboutBusiness,
                serviceCategoryId: serviceCategoryId,
                businessTypeList: businessTypeListArray,
                openingHours: openingHoursArray
            }
            const userSave = await new Users(userPayload);
            const data1 = await userSave.save();
            if (data1) {
                const userId = data1._id;
                    const userData = await Users.findOne({
                        _id: userId
                    }).populate('serviceTypeList');
                    const token = Helpers.createJwt(userSave);
                    userData.token = token;
                    return reply({
                        status: true,
                        message: 'User successfully registered.',
                        data: userData
                    })
                }
        } else {
            return reply({
                status: false,
                message: 'User already exists.',
                data: {}
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
    path: '/admin/barberSignup',
    config: {
        tags: ['api', 'users'],
        description: 'Create Barber Business Account.',
        notes: ['On success'],
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().optional(),
                userType: Joi.string().optional(),
                phone:Joi.string().optional(),
                address: Joi.string().optional(),
                city: Joi.string().optional(),
                state: Joi.string().optional(),
                aboutBusiness: Joi.string().optional(),
                businessTypeList: Joi.array().optional(),
                serviceCategoryId: Joi.any().optional(),
                openingHours: Joi.array().optional()
            }
        },
        handler
    }
}


export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}