import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/users';
const Mailer = require('../../config/sendMail.js')
const randomstring = require("randomstring");
import AwsServices from '../../config/file_upload';
import SubscriptionHistory from '../../models/userSubscriptionHistory';
import OpeningHours from '../../models/openingHours'
var admin = require('firebase-admin');
var serviceAccount = require('../../firebase/privateKey.json');
let defaults = {};
/**
Api to Edit profile. 
  **/
const handler = async (request, reply) => {
    try {
        // console.log('ss');
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        // console.log(user);
        if (user) {
            var openingHours=_.get(request,'payload.openingHours','');
            var openingHoursArray=[];          
            var myOpeningHoursArray=[];
            for(var i=0;i<openingHours.length;i++){
                openingHoursArray.push(openingHours[i]);
                var o=openingHours[i].split('|')
                var openingData=await OpeningHours.findOne({_id:o[0]},{dayName:1})
                if(o.length==2){
                    var openingObject={
                        openiningId:o[0],
                        dayName:openingData.dayName,
                        status:"closed"
                    }
                    myOpeningHoursArray.push(openingObject);
                }else{
                var openingObject={
                        openiningId:o[0],
                        dayName:openingData.dayName,
                        startTime:o[1],
                        endTime:o[2],
                        status:"opened",
                }
                    myOpeningHoursArray.push(openingObject);
                }
            }
            var data={
                myOpeningHoursArray:myOpeningHoursArray,
                openingHours:openingHoursArray
            }
             await Users.findOneAndUpdate({
                _id: userId
            }, {
                $set: data
            }, {
                new: true
            })

            const userData=await Users.findOne({
                _id:userId
            },{myOpeningHoursArray:1})
            
            return reply({
                status: true,
                message: 'Upadated opening hours successfully.',
                data: userData
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
    path: '/user/editOpeningHours',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Update profile.',
        notes: ['On success'],
        validate: {
            payload: {
                openingHours: Joi.array().optional(),
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}