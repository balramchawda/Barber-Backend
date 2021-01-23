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
	            const payload = request.payload;
	            const email = user.email;
	            if (payload.userImage) {
	                // console.log(payload.userImage);
	                var buf = new Buffer(payload.userImage, 'base64');
	                // console.log(buf);
	                const imageUrl = await AwsServices.upload("userProfile.png", buf);
	                delete payload.userImage;
	                payload.userImage = imageUrl;
	            } else {
	                payload.userImage = user.userImage;
	            }

if(payload.name){
payload.name = payload.name;
}else{
 payload.name = user.name;
}
console.log("name",payload.name)	            
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
	                      console.log(doc.id)
	                        db.collection("users").doc(doc.id).update({
	                            userImageUrl: payload.userImage,
	                            userDisplayName: payload.name
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

	            const userData = await Users.findOne({
	                _id: userId
	            }).populate('serviceTypeList');
	            const subscriptionData = await SubscriptionHistory.findOne({
	                $and: [{
	                    userId: user._id
	                }, {
	                    status: 1
	                }]
	            });
	            if (subscriptionData) {
	                userData.subsRemainingDays = subscriptionData.remainingDays;

	            } else {
	                userData.subsRemainingDays = "";
	            }
	            return reply({
	                status: true,
	                message: 'User info updated successfully.',
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
	    path: '/user/editProfile',
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
	                userImage: Joi.any().optional()
	            }
	        },
	        handler
	    }
	}

	export default (server, opts) => {
	    defaults = Hoek.applyToDefaults(defaults, opts)
	    server.route(routeConfig)
	}