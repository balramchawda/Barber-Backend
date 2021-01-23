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
        const payload=request.payload;
        const userType=_.get(request,"payload.userType",'');
            // const data={serviceCategoryName:"Massage for Women",userType:"individual",imageUrl:"https://trim-app.s3.us-west-1.amazonaws.com/trim-app/1593428880325workplace.png",status:"1"}
            // const obj= await new ServiceCategory(data);
            // await obj.save();
            // console.log(userType);
            if(userType!=''){
            const ServiceCategoryData=await ServiceCategory.find({userType});    
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
    }else{
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
    method: 'POST',
    path: '/admin/getServiceCategoryList',
    config: {
        tags: ['api', 'users'],
        description: 'Get all service categories list.',
        notes: ['On success'],
        validate: {
            payload: {
                userType: Joi.string().optional(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}