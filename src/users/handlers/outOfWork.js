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
        if (user) {
                if(user.outOfWork=="0"){
                    const outOfWorkStatusUpdate = await Users.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    outOfWork:"1"
                }
            }, {
                new: true
            });        
                }else{
                    const outOfWorkStatusUpdate = await Users.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    outOfWork:"0"
                }
            }, {
                new: true
            });
            }
            return reply({
                status:true,
                message:"Out of work status updated."
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
    path: '/user/outOfWork',
    config: {
        auth:'jwt',
        tags: ['api', 'users'],
        description: 'Update  out of work status.',
        notes: ['On success'],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}