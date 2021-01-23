import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/admin';
const Mailer = require('../../config/sendMail.js')
const randomstring = require("randomstring");

let defaults = {};
/**
Api to update password. 
  **/
const handler = async (request, reply) => {
    try {
        const email="admin@gmail.com" 
        // const email = _.get(request, 'payload.email', '');
        const user = await Users.findOne({
            email
        });
        console.log(user);
        if (true) {
            console.log(request.payload)
            // const newPass = randomstring.generate({
            //     length: 8,
            //     charset: 'alphanumeric',
            //     capitalization: 'uppercase'
            // });
            const password=_.get(request,'payload.password','');
            const hashPassword = Helpers.hashPassword(password);
            const passwordUpdate = await Users.findOneAndUpdate({
                email: email
            }, {
                $set: {
                    password: password
                }
            }, {
                new: true
            });
            // console.log(passwordUpdate);
        
                return reply({
                    status: true,
                    message: "Your password has been changed."
                });
            } else {
            return reply({
                status: false,
                message: "Your email is not registered."
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
    path: '/admin/updatePassword',
    config: {
        tags: ['api', 'users'],
        description: 'Forgot password for Barber account.',
        notes: ['On success'],
        validate: {
            payload: {
                email: Joi.string().required(),
                password:Joi.string().required()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}