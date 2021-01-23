import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import Users from '../../models/customerUser';
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
        const userId = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: userId
        }).lean();
        if (user) {
            // var email=user.email;
            const payload = request.payload;
            // var file=payload['userImage'];
            // if(file!='undefined'||file!=" "){
            // const imageUrl=await AwsServices.upload("userProfile.png",file);
            // delete payload.userImage;
            // payload.userImage=imageUrl;
            // }else{
            //     payload.userImage=user.userImage;
            // }
            // if(payload.name!=' '||payload.name!="undefined"){
            //     payload.name=payload.name;
            // }else{
            //     payload.name=user.name;
            // }
             var email=user.email;
            if(payload.userImage){
            var buf = new Buffer(payload.userImage, 'base64');
            console.log(buf);
            const imageUrl=await AwsServices.upload("userProfile.png",buf);
            delete payload.userImage;
            payload.userImage=imageUrl;
                console.log(imageUrl)
            }
            else{
                payload.userImage=user.userImage;
            }
            if(payload.name){
                payload.name=payload.name;
            }else{
                payload.name=user.name;
            }
            // var db = admin.firestore();
if (!admin.apps.length) {
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://fluttertrim.firebaseio.com"
}); 
}
const db = admin.firestore();
db.collection("users").where("userEmail", "==", email)
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // console.log(doc.id, " => ", doc.data());
          // Build doc ref from doc.id
          db.collection("users").doc(doc.id).update({
                userImageUrl:payload.userImage,
                userDisplayName:payload.name
          });
      });
 })
            await Users.findOneAndUpdate({
                _id: userId
            }, {
                $set: payload
            }, {
                new: true
            })
            return reply({
                status: true,
                message: 'User info updated successfully.',
                // data: user
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
    path: '/customerUser/editProfile',
    config: {
        auth: 'jwt',
        tags: ['api', 'users'],
        description: 'Update profile.',
        notes: ['On success'],
        validate: {
            payload: {
                name: Joi.string().optional(),
                phone: Joi.string().optional(),
                gender: Joi.string().optional(),
                age: Joi.string().optional(),
                userImage: Joi.any().optional(),
                address:Joi.any().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}