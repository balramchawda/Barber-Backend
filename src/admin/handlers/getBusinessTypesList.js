import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import BusinessType from '../../models/businessType';

let defaults = {};
/**
Api to getBusinessTypeList. 
  **/
const handler = async (request, reply) => {
    try {
        const payload=request.payload;
        const userType=_.get(request,"payload.userType",'');
        // var data={businessTypeName:"Hair Salons",userType:"business",status:"1"}
        // var obj= await new BusinessType(data);
        // await obj.save();
        // var data={businessTypeName:"Hair Salons",userType:"individual",status:"1"}
        // var obj= await new BusinessType(data);
        // await obj.save();
        // var data={businessTypeName:"Nail Spa",userType:"business",status:"1"}
        // var obj= await new BusinessType(data);
        // await obj.save();
        // var data={businessTypeName:"Nail Spa",userType:"individual",status:"1"}
        // var obj= await new BusinessType(data);
        // await obj.save();
        // var data={businessTypeName:"Hair Stylists",userType:"business",status:"1"}
        // var obj= await new BusinessType(data);
        // await obj.save();
        const BusinessTypeData=await BusinessType.find({userType});    
        // console.log(BusinessTypeData);
        if(BusinessTypeData.length > 0){
            return reply({
                status:true,
                message:"Get all business types.",
                data:BusinessTypeData
            })
        }else{
            return reply({
                status:false,
                message:"Not Data Found.",
                data:[]
            })
        }
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
    method: 'POST',
    path: '/admin/getBusinessTypeList',
    config: {
        tags: ['api', 'users'],
        description: 'Get all business type list.',
        notes: ['On success'],
        validate: {
            payload: {
                userType: Joi.string().required(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}