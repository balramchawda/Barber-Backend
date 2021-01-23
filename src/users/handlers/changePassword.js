import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
const Mailer = require('../../config/sendMail.js')
const randomstring = require("randomstring");

let defaults = {};
/**
Api to Change Password. 
**/
const handler = async (request, reply) => {
    try {
        const id = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: id
        }).lean();
        if (user) {
            const oldPassword = _.get(request, 'payload.oldPassword', '');
            const newPassword = _.get(request, 'payload.newPassword', '');
            const match = Helpers.matchPassword(oldPassword, user.password);
            if (match) {
                const hashPassword = Helpers.hashPassword(newPassword);
                const updatePassword = await Users.findOneAndUpdate({
                    _id: id
                }, {
                    $set: {
                        password: hashPassword
                    }
                }, {
                    new: true
                });
                if (updatePassword) {
                    return reply({
                        status: true,
                        message: "Changed password successfully."
                    })
                }
            }else{
                return reply({
                    status: false,
                    message: "Your old password is incorrect."
                })
            }
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
    path: '/user/changePassword',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Forgot password for Barber Customer account.',
        notes: ['On success'],
        validate: {
            payload: {
                oldPassword: Joi.string().required(),
                newPassword: Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}