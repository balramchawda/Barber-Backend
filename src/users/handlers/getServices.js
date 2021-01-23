import Hoek from 'hoek'
import Joi from 'joi'
import _ from 'lodash'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Services from '../../models/serviceDetails'
import TempService from '../../models/storeTemporyServices'

let defaults = {}
/*
 * API to getAllServices
 **/
const handler = async (request, reply) => {
    try {
        // const id = await Helpers.extractUserId(request)
        const email=_.get(request,'payload.email','');
        const user = await Services.find({
            email:email
        }).sort({createdAt:-1});
        if (user.length>0) {
            return reply({
                status:true,
                message:"Get all services.",
                data:user
            })   
        }else{
            return reply({
                status:false,
                message:"No data found",
                data:[]
            })
        }

        // user.locations = await Location.find({ userId: id })

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
    path: '/user/getMyServices',
    config: {
        tags: ['api', 'me'],
        description: 'Returns a user object based on JWT along with a new token.',
        notes: [],
        validate:{
            payload:{
                email:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}