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
import FavouriteImage from '../../models/favouriteImage'

var serviceAccount = require('../../firebase/privateKey.json');
let defaults = {};
/**
Api to WorkplaceImage. 
  **/
const handler = async (request, reply) => {
    try {
        // console.log('ss');
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        },{images:1}).lean();
        // console.log(userId)
        if (user) {
            var images=user.images;
            if(images.length>0){
                console.log('enter',images.length);
                var images=user.images;
                var imageArray=[];
                for (var i = 0; i < images.length; i++) {
                        const imageId = images[i].id;
                            images[i].isFavourite = false;
                        const data1 = await FavouriteImage.count({
                            $and: [{
                                isFavourite: true
                            }, {
                                imageId: imageId
                            }]
                        });
                        if (data1) {
                            images[i].totalFavouriteCount = data1;
                        } else {
                            images[i].totalFavouriteCount = 0;

                        }
                        imageArray.push(images[i]);
                    }      
             return reply({
                status: true,
                message: 'Get all workplace images.',
                data: imageArray
            })
            }else{
              return reply({
                status: false,
                message: 'No Data Found',
                data: []
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
    method: 'GET',
    path: '/user/getAllWorkplaceImages',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Get workplace image.',
        notes: ['On success'],
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}