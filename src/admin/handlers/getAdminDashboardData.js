import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Barber from '../../models/users';
import Customer from '../../models/customerUser';
import Booking from '../../models/booking';
import ServiceCategory from '../../models/serviceCategory';
import SubscriptionPlan from '../../models/subscriptionPlan';
let defaults = {};
/**
Api to getAdminDashboardData. 
  **/
const handler = async (request, reply) => {
    try {
        const totalUser=await Customer.count({});               
        if(totalUser){
            var totalUser=totalUser
        }else{
        const totalUser=0;               
        }
        const totalBarber=await Barber.count({});               
        if(totalBarber){
            var totalBarber=totalBarber
        }else{
        const totalBarber=0;               
        }
        const totalSubscriptionPlan=await SubscriptionPlan.count({});               
        if(totalSubscriptionPlan){
            var totalSubscriptionPlan=totalSubscriptionPlan
        }else{
        const totalSubscriptionPlan=0;               
        }
        const totalServiceCategory=await ServiceCategory.count({});               
        if(totalServiceCategory){
            var totalServiceCategory=totalServiceCategory
        }else{
        const totalServiceCategory=0;               
        }
        return reply({
            status:true,
            totalServiceCategory:totalServiceCategory,
            totalUser:totalUser,
            totalBarber:totalBarber,
            totalSubscriptionPlan:totalSubscriptionPlan
        })
    } catch (error) {
        // console.log(error.message);
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'GET',
    path: '/admin/getAdminDashbardData',
    config: {
        tags: ['api', 'users'],
        description: 'Get all admin data.',
        notes: ['On success'],
        validate: {
           
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}