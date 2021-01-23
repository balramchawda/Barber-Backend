import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import User from '../../models/customerUser';
let defaults = {};
/**
Api to updateCustomerStatus. 
  **/
const handler = async (request, reply) => {
    try {
        const userId=_.get(request,'payload.userId','');
        console.log(userId);
        const userData=await User.findOne({
            _id:userId
        })
        if(userData){
            var status=userData.status;
            if(status){
                // console.log(status);
              await User.findOneAndUpdate({
                _id:userId
              },{$set:{status:false}},{new:true})
            }else{
            await User.findOneAndUpdate({
                _id:userId
              },{$set:{status:true}},{new:true})
            }
            return reply({
                status:true,
                message:'Customer status updated successfully.'
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
    path: '/admin/updateCustomerStatus',
    config: {
        tags: ['api', 'users'],
        description: 'Update customer status.',
        notes: ['On success'],
        validate: {
         payload: {
            userId:Joi.string().optional()    
              }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}