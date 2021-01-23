import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';

let defaults = {};
/**
Api to update status outOfWork. 
  **/
const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        const user = await Users.find({
            _id: id
        }).lean();
        const businessId=_.get(request,'payload.businessId','');
        if (user) {
                    const outOfWorkStatusUpdate = await Users.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    associateWith:businessId
                }
            }, {
                new: true
            });
            
            return reply({
                status:true,
                message:"Associated with business successfully."
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
    method: 'POST',
    path: '/user/associateWithBusiness',
    config: {
        auth:'jwt',
        tags: ['api', 'users'],
        description: 'Associate with business.',
        notes: ['On success'],
          validate: {
            payload: {
                businessId:Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}