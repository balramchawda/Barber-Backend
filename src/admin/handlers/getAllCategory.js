import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import BusinessType from '../../models/businessType';
import ServiceCategory from '../../models/serviceCategory';
let defaults = {};
/**
Api to getServiceCategoryList. 
  **/
const handler = async (request, reply) => {
    try {
        
        const ServiceCategoryData=await ServiceCategory.find({});    
        // console.log(BusinessTypeData);
        if(ServiceCategoryData.length > 0){
            return reply({
                status:true,
                message:"Get all service categories.",
                data:ServiceCategoryData
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
    method: 'GET',
    path: '/admin/getAllCategoryList',
    config: {
        tags: ['api', 'users'],
        description: 'Get all service categories list.',
        notes: ['On success'],
        
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}