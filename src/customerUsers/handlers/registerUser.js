import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/customerUser'
var admin = require('firebase-admin');
var serviceAccount = require('../../firebase/privateKey.json');
// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()
import AwsServices from '../../config/file_upload';


/** 
Api to create new user
**/

let defaults = {}

const handler = async (request, reply) => {
    try {
        let payload = request.payload
        // console.log(payload, 'payload======>');
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                // databaseURL: "https://fluttertrim.firebaseio.com"
            });
        }
        const db = admin.firestore();
        const email = _.get(request, 'payload.email', '');
        const password = _.get(request, 'payload.password', '');
        const loginType = _.get(request, 'payload.loginType', '');
        if (loginType == "Google") {
            const userData = await Users.findOne({
                email: email
            });
            if (userData) {
                const name = _.get(request, 'payload.name', '');
                var imageUrl = _.get(request, 'payload.imageUrl', '');
                const deviceType = _.get(request, 'payload.deviceType', '');
                if (imageUrl) {
                    var imageUrl1 = imageUrl
                } else {
                    var imageUrl1 = "https://trim-app.s3.us-west-1.amazonaws.com/trim-app/1594201446226userProfile.png"
                }
                var data = {
                    name: name,
                    userImage: imageUrl1,
                    deviceType: deviceType
                }
                await Users.findOneAndUpdate({
                    email: email
                }, {
                    $set: data
                }, {
                    new: true
                });
                db.collection("users").where("userEmail", "==", email)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // console.log(doc.id, " => ", doc.data());
                            // Build doc ref from doc.id
                            db.collection("users").doc(doc.id).update({
                                userImageUrl: imageUrl,
                                userDisplayName: name
                            });
                        });
                    })
                const dataUser = await Users.findOne({
                    email: email
                })
                const token = Helpers.createJwt(dataUser);
                dataUser.token = token;
                return reply({
                    status: true,
                    message: "Login successfully.",
                    data: dataUser
                })
            }
        }
        const user = await Users.findOne({
            email
        })
        if (!user) {
            let hashPassword;
            if (password) {
                hashPassword = Helpers.hashPassword(password);
            } else {
                hashPassword = "";
            }
            let payload = request.payload;
            var file = payload['userImage'];
            // console.log(file);
            // const imageUrl=await AwsServices.upload("demoUser.png",file);
            if (imageUrl) {
                var imageUrl = _.get(payload, 'imageUrl', '');
            } else {
                var imageUrl = "https://trim-app.s3.us-west-1.amazonaws.com/trim-app/1594201446226userProfile.png";
            }
            const name = _.get(request, 'payload.name', '');
            const chatUserId = name + "-Customer-" + Helpers.generateNumber()

            const user = {
                userEmail: email,
                userName: chatUserId,
                userDisplayName: name,
                userImageUrl: imageUrl
            }
            const createdId = Helpers.alphanumericId();
            await db.collection('users').doc(createdId).set(user).then(function(data) {
                console.log(data);
            }).catch(function(error) {
                console.log(error)
            })
            const gender = _.get(request, 'payload.gender', '');
            const age = _.get(request, 'payload.age', '');
            const phone = _.get(request, 'payload.phone', '');
            const deviceToken = _.get(request, 'payload.deviceToken', '');
            const deviceType = _.get(request, 'payload.deviceType', '');
            const FBID = _.get(request, 'payload.FBID', '');
            const GoogleID = _.get(request, 'payload.GoogleID', '');
            const countryCode = _.get(request, 'payload.countryCode', '');
            const userPayload = {
                name: name,
                email: email,
                countryCode: countryCode,
                password: hashPassword,
                userImage: imageUrl,
                gender: gender,
                phone: phone,
                age: age,
                deviceToken: deviceToken,
                deviceType: deviceType,
                loginType: loginType,
                FBID: FBID,
                GoogleID: GoogleID,
                chatUserId: chatUserId,
                accountDetails: {}
            }
            const userSave = await new Users(userPayload);
            const data1 = await userSave.save();
            if (data1) {
                const userId = userSave._id;
                const user = await Users.findOne({
                    _id: userId
                })
                // console.log(user);
                // console.log(serviceId);
                const token = Helpers.createJwt(userSave);
                user.token = token;
                return reply({
                    status: true,
                    message: 'User successfully registered.',
                    data: user
                })
            }

        } else {
            return reply({
                status: false,
                message: 'User already exists.',
                data: {}
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
    path: '/customerUser/signup',
    config: {
        tags: ['api', 'users'],
        description: 'Create Barber Customer Account.',
        notes: ['On success'],
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().optional(),
                phone: Joi.string().optional(),
                imageUrl: Joi.any().optional(),
                countryCode: Joi.string().optional(),
                imageName: Joi.any().optional(),
                gender: Joi.string().optional(),
                age: Joi.string().optional(),
                deviceToken: Joi.string().optional(),
                deviceType: Joi.string().optional(),
                loginType: Joi.string().optional(),
                FBID: Joi.string().optional(),
                GoogleID: Joi.string().optional()
            }
        },
        handler
    }
}


export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}