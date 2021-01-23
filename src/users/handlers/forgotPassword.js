import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
const Mailer = require('../../config/sendMail.js')
const randomstring = require("randomstring");

let defaults = {};
/**
Api to forgot password. 
  **/
const handler = async (request, reply) => {
    try {
        const email = _.get(request, 'payload.email', '');
        const user = await Users.findOne({
            email
        });
        if (user) {
            const newPass = randomstring.generate({
                length: 8,
                charset: 'alphanumeric',
                capitalization: 'uppercase'
            });
            const hashPassword = Helpers.hashPassword(newPass);
            const passwordUpdate = await Users.findOneAndUpdate({
                email: email
            }, {
                $set: {
                    password: hashPassword
                }
            }, {
                new: true
            });
            console.log(passwordUpdate);
            var mailerObj = new Mailer();
            var subject = 'Your password has been changed.';
            var html = 'Hello Dear, <br>Your new password is "' + newPass + '"';
            mailerObj.send(email, subject, html, function(err, info) {
                if (err) {
                    console.log(err);
                }
                return reply({
                    status: true,
                    message: "We sent new password on your email."
                });
            })
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
    path: '/user/forgotPassword',
    config: {
        tags: ['api', 'users'],
        description: 'Forgot password for Barber account.',
        notes: ['On success'],
        validate: {
            payload: {
                email: Joi.string().required(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}