import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Service from '../../models/serviceCategory';
let defaults = {};
/**
Api to Update Category status. 
  **/
const handler = async (request, reply) => {
    try {
        const categoryId=_.get(request,'payload.categoryId','');
        const serviceCategoryData=await Service.findOne({
            _id:categoryId
        })
        if(serviceCategoryData){
            var status=serviceCategoryData.status;
            if(status){
              await Service.findOneAndUpdate({
                _id:categoryId
              },{$set:{status:false}},{new:true})
            }else{
            await Service.findOneAndUpdate({
                _id:categoryId
              },{$set:{status:true}},{new:true})
            }
            return reply({
                status:true,
                message:'Category status updated successfully.'
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
    path: '/admin/updateCategoryStatus',
    config: {
        tags: ['api', 'users'],
        description: 'Update category status.',
        notes: ['On success'],
        validate: {
         payload: {
            categoryId:Joi.string().optional()    
              }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}