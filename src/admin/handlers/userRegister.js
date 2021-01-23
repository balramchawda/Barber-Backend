import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'

// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()

/** 
Api to create new user
**/

let defaults = {}

const handler = async (request, reply) => {
    try {
        let payload = request.payload
        console.log(payload, 'payload======>');
        const email = _.get(request, 'payload.email', '');
        const password = _.get(request, 'payload.password', '');
        const user = await Users.findOne({
            email
        })
        if (!user) {
            let hashPassword;
            if(password){
             hashPassword = Helpers.hashPassword(password);
            }else{
                 hashPassword="";
            }
            let payload = request.payload
            const name = _.get(request, 'payload.name', '');
            const phone = _.get(request, 'payload.phone', '');
            const deviceToken = _.get(request, 'payload.deviceToken', '');
            const deviceType = _.get(request, 'payload.deviceType', '');
            const loginType = "Normal";
            const userPayload = {
                name: name,
                email: email,
                phone:phone,
                password: hashPassword    
            }
            const userSave = await new Users(userPayload);
            const data1 = await userSave.save();
            if (data1) {
                const userId=userSave._id;
                    const user = await Users.findOne({
                        _id: userId
                    })
                    const token = Helpers.createJwt(userSave);
                    user.token = token;
                    return reply({
                        status: true,
                        message: 'User successfully registered.',
                        data: user
                    })
                }
            
        } else {
            return reply({
                status: false,
                message: 'User already exists.',
                data: {}
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
    path: '/admin/customerSignup',
    config: {
        tags: ['api', 'users'],
        description: 'Create Barber Customer Account.',
        notes: ['On success'],
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().optional(),
                phone:Joi.string().optional()
              }
        },
        handler
    }
}


export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}