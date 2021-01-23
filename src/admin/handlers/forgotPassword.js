import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/admin';
// const Mailer = require('../../config/sendMail.js')
const EmailService = require('../../services/email_service.js')
const randomstring = require("randomstring");

let defaults = {};
/**
Api to forgot password. 
  **/
const handler = async (request, reply) => {
    try {
        const email = _.get(request, 'payload.email', '');
        // const user = await Users.findOne({
        //     email
        // });
        if (true) {
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
            // var mailerObj = new Mailer();
            // var subject = 'Your password resetlink.';
            var link="http://13.52.121.119:3003/update-password/"+email;
            // var html = 'Hello Dear, <br>This is new password resetLink "' + link + '"';
            // mailerObj.sendMail(email, function(err, info) {
            let body = {
                subject: 'Your password resetlink.',
                // link: "http://13.52.121.119:3003/update-password/"+email,
                html: 'Hello Dear, <br>This is new password resetLink "' + link + '"'
            }
            EmailService.forgotPassword(email, body, function(err, info) {
                if (err) {
                    console.log(err);
                }
                return reply({
                    status: true,
                    message: "We sent resent link for new password on your email."
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
    path: '/admin/forgotPassword',
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