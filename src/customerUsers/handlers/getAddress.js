import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
import customerUsers from '../../models/customerUser';
const Mailer = require('../../config/sendMail.js')
const randomstring = require("randomstring");
import AwsServices from '../../config/file_upload';
var admin = require('firebase-admin');
var serviceAccount = require('../../firebase/privateKey.json');
let defaults = {};

/**
Api to Edit Address. 
  **/

const handler = async (request, reply) => {
    try {

        var userId = await Helpers.extractUserId(request)
        var type = _.get(request, 'payload.type', '');
        if (type == "1" || type == "Barber") {
            var user = await Users.findOne({
                _id: userId
            }).lean();
        } else {
            var user = await customerUsers.findOne({
                _id: userId
            }).lean();
        }

        if (user) {
            // console.log(user.address)
            var res = await Helpers.isEmpty(user.address);
            // console.log(res)
            if (res) {
                var address = {
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zipcode: ''
                }
                return reply({
                    status: true,
                    message: "Get Address.",
                    data: address
                })
            } else {
                return reply({
                    status: true,
                    message: "Get Address.",
                    data: user.address
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
    path: '/allUsers/getAddress',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Update profile.',
        notes: ['On success'],
        validate: {
            payload: {
                type: Joi.string().optional(),
                // phone: Joi.string().optional(),
                // gender: Joi.string().optional(),
                // age: Joi.string().optional(),
                // userImage: Joi.any().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}