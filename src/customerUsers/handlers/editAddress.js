import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import customerUsers from '../../models/customerUser';
import Users from '../../models/users';
const Mailer = require('../../config/sendMail.js')
const randomstring = require("randomstring");
import AwsServices from '../../config/file_upload';
var admin = require('firebase-admin');
var serviceAccount = require('../../firebase/privateKey.json');
let defaults = {};
/**
Api to Edit profile. 
  **/
const handler = async (request, reply) => {
    try {
        var userId = await Helpers.extractUserId(request)
        var type=_.get(request,'payload.type','');
        if(type=="1"){
        var user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {
            // var email=user.email;

            const payload = request.payload;
           // console.log(user);
            // var email=user.email;
            var location=user.location;
            console.log(location);
            var address=payload.address;
            var latitude=address.latitude;
            var longitude=address.longitude;
            var coordinates=[];
            coordinates.push(parseFloat(longitude))
            coordinates.push(parseFloat(latitude));
            console.log(coordinates);
            console.log(location.coordinates);
            location.coordinates=coordinates;
            console.log(location.coordinates);
            payload.location=location;
            await Users.findOneAndUpdate({
                _id: userId
            }, {
                $set: payload
            }, {
                new: true
            })
            return reply({
                status: true,
                message: 'User address updated successfully.',
                // data: user
            })
        }
                }else{
        var user = await customerUsers.findOne({
            _id: userId
        }).lean();
        if (user) {
            const payload = request.payload;
            
            await customerUsers.findOneAndUpdate({
                _id: userId
            }, {
                $set: payload
            }, {
                new: true
            })
            return reply({
                status: true,
                message: 'User address updated successfully.',
                // data: user
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
    path: '/allUsers/editAddress',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Update profile.',
        notes: ['On success'],
        validate: {
            payload: {
                address:Joi.any().optional(),
                type:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}