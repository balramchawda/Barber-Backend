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
        console.log(request.payload);
        // console.log('sss');
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                // databaseURL: "https://fluttertrim.firebaseio.com"
            });
        }
        const db = admin.firestore();
        const payload = request.payload;
        var chatRoomId = payload.chatRoomId;
        var splitData = chatRoomId.split('_');
        // console.log(splitData);
        var a = splitData[0] + "_" + splitData[1];
        var b = splitData[1] + "_" + splitData[0];
        // console.log(a)
        // console.log(b)
        await db.collection("chatRoom").where('chatRoomId', '==', a)
            .get()
            .then(async function(querySnapshot) {
                querySnapshot.forEach(async function(doc) {
                    if (doc.id != undefined && doc.id != '' && doc.id != null) {
                              // var ss=await db.collection("chatRoom").where('chatRoomId', '==', doc.id)
                              //   console.log(ss.data());
                              // console.log(doc.data())
                        return reply({
                            status: true,
                            message: "Already Exist",
                            // data:doc.data()
                        })
                    } else {
                        db.collection("chatRoom").where('chatRoomId', '==', b)
                            .get()
                            .then(function(querySnapshot) {
                                querySnapshot.forEach(async function(doc) {
                                    // console.log("1",doc.id);
                                    if (doc.id != undefined && doc.id != '' && doc.id != null) {
                                        // console.log("ss1",querySnapshot)
                                        return reply({
                            status: true,
                            message: "Already Exist",
                            // data:doc.data()
                        })
                                    } else {
                                        const user = {
                                            userDisplayName_0: payload.userDisplayName_0,
                                            userDisplayName_1: payload.userDisplayName_1,
                                            chatRoomId: payload.chatRoomId,
                                            chatCount_0: 0,
                                            chatCount_1: 0,
                                            users: [payload.userDisplayName_0, payload.userDisplayName_1]
                                        }
                                        const createdId = payload.chatRoomId
                                        await db.collection('chatRoom').doc(createdId).set(user).then(function(data) {
                                            return reply({
                                                status: true,
                                                message: "ChatRoom ID created successfully."
                                            })
                                        }).catch(function(error) {
                                            return reply({
                                                status: false,
                                                message: error.message
                                            })
                                        })
                                    }
                                })
                            })
                    }
                    // console.log("querySnapshot",querySnapshot);
                })
                db.collection("chatRoom").where('chatRoomId', '==', b)
                    .get()
                    .then(async function(querySnapshot) {
                        querySnapshot.forEach(async function(doc) {
                             if (doc.id != undefined && doc.id != '' && doc.id != null) {
                                return reply({
                            status: true,
                            message: "Already Exist",
                            // data:doc.data()
                        })
                            } else {
                                const user = {
                                    userDisplayName_0: payload.userDisplayName_0,
                                    userDisplayName_1: payload.userDisplayName_1,
                                    chatRoomId: payload.chatRoomId,
                                    chatCount_0: 0,
                                    chatCount_1: 0,
                                    users: [payload.userDisplayName_0, payload.userDisplayName_1]
                                }
                                const createdId = payload.chatRoomId
                                await db.collection('chatRoom').doc(createdId).set(user).then(function(data) {
                                    return reply({
                                        status: true,
                                        message: "ChatRoom ID created successfully."
                                    })
                                }).catch(function(error) {
                                    return reply({
                                        status: false,
                                        message: error.message
                                    })
                                })
                            }
                        })
                        const user = {
                            userDisplayName_0: payload.userDisplayName_0,
                            userDisplayName_1: payload.userDisplayName_1,
                            chatRoomId: payload.chatRoomId,
                            chatCount_0: 0,
                            chatCount_1: 0,
                            users: [payload.userDisplayName_0, payload.userDisplayName_1]

                        }
                        const createdId = payload.chatRoomId
                        await db.collection('chatRoom').doc(createdId).set(user).then(function(data) {
                            return reply({
                                status: true,
                                message: "ChatRoom ID created successfully."
                            })
                        }).catch(function(error) {
                            return reply({
                                status: false,
                                message: error.message
                            })
                        })
                    })
            }).catch(function(error) {
                return reply({
                    status: false,
                    message: error.message
                })
            })
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
    path: '/allUsers/createChatRoomId',
    config: {
        tags: ['api', 'users'],
        description: 'Update profile.',
        notes: ['On success'],
        validate: {
            payload: {
                chatRoomId: Joi.string().optional(),
                userDisplayName_0: Joi.string().optional(),
                userDisplayName_1: Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}