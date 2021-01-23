import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
const Mailer = require('../../config/sendMail.js')
const randomstring = require("randomstring");
import AwsServices from '../../config/file_upload';
import SubscriptionHistory from '../../models/userSubscriptionHistory';
var admin = require('firebase-admin');
var serviceAccount = require('../../firebase/privateKey.json');
let defaults = {};
/**
Api to Get Opening hours. 
  **/
const handler = async (request, reply) => {
    try {
        // console.log('ss');
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        },{myOpeningHoursArray:1}).lean();
        // console.log(user);
        if (user) {
            return reply({
                status: true,
                message: 'Get my openingHours.',
                data: user
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
    method: 'GET',
    path: '/user/getMyOpeningHours',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Get my opening hours',
        notes: ['On success'],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}