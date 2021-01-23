import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import User from '../../models/users';
let defaults = {};
/**
Api to updateBarberStatus. 
  **/
const handler = async (request, reply) => {
    try {
        const payload=request.payload;
        const userId=_.get(payload,'userId','');
        // console.log(userId);
        const userData=await User.findOne({
            _id:userId
        })
        if(userData){
            var status=userData.status;
                // console.log(status);
            if(status){
                // console.log(status,"enter1")
              await User.findOneAndUpdate({
                _id:userId
              },{$set:{status:false}},{new:true})
           
           }else{
                // console.log(status,"enter2")

            await User.findOneAndUpdate({
                _id:userId
              },{$set:{status:true}},{new:true})
            }
            return reply({
                status:true,
                message:'Barber status updated successfully.'
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
    path: '/admin/updateBarberStatus',
    config: {
        tags: ['api', 'users'],
        description: 'Update barber status.',
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