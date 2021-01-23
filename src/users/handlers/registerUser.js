import _ from 'lodash'
import Hoek from 'hoek'
import Joi from 'joi'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Services from '../../models/serviceDetails'
import SubscriptionHistory from '../../models/userSubscriptionHistory'
import SubscriptionPlan from '../../models/subscriptionPlan'
// import AwsServices from '../../services/aws_service'
// const awsServices = new AwsServices()
import BusinessOwner from '../../models/businessOwners';
import AwsServices from '../../config/file_upload';
const uniqid = require('uniqid');
var admin = require('firebase-admin');
import OpeningHours from '../../models/openingHours';
var serviceAccount = require('../../firebase/privateKey.json');
import TempServices from '../../models/storeTemporyServices';

/*
 * Api to create new user
 **/

let defaults = {}

const handler = async (request, reply) => {
    // const email = _.get(request, 'payload.email', '')
    try {
        let payload = request.payload
        // console.log(payload, 'payload======>');
        const email = _.get(request, 'payload.email', '');
        const password = _.get(request, 'payload.password', '');
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
            let payload = request.payload
            // if (_.get(payload, 'image', '') !== '' && await Helpers.checkBase64(payload.image)) {
            //   let originalBlobArray = payload.image.split(',')
            //   var buf = new Buffer(originalBlobArray[1], 'base64')
            //   const imageUrl = await awsServices.uploadImage(payload.imageName, buf, 'user')
            //   delete payload.image
            //   payload.image = imageUrl
            // }
            // console.log('ssssss');
            const imageUrl = "https://trim-app.s3.us-west-1.amazonaws.com/trim-app/1594201446226userProfile.png";
            const name = _.get(request, 'payload.name', '');
            const chatUserId = name + "-Barber-" + Helpers.generateNumber()
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    // databaseURL: "https://fluttertrim.firebaseio.com"
                });
            }
            const db = admin.firestore();
            const user = {
                userEmail: email,
                userName: chatUserId,
                userDisplayName: name,
                userImageUrl: imageUrl
            }
            const createdId = Helpers.alphanumericId();
            await db.collection('users').doc(createdId).set(user).then(function(data) {
                // console.log(data);
            }).catch(function(error) {
                // console.log(error)
            })

            var images = [];

            if (payload.images) {
                var file = payload.images;
                if (file.length > 0) {
                    for (var i = 0; i < file.length; i++) {
                        //  var buf = new Buffer(payload.images[i], 'base64');
                        //  const imageUrl=await AwsServices.upload("workplace.png",buf);
                        //  // console.log(imageUrl); 

                        const imageObject = {
                            id: uniqid() + String(Date.now())+i,
                            imageUrl: file[i]
                        }
                        images.push(imageObject);
                    }
                }
            }

            const userType = _.get(request, 'payload.userType', '');
            const associateWith = _.get(request, 'payload.associateWith', '');
            const aboutBusiness = _.get(request, 'payload.aboutBusiness', '');
            const specialOfferDeals = _.get(request, 'payload.specialOfferDeals', '');
            const subscriptionId = _.get(request, 'payload.subscriptionId', '');
            const gender = _.get(request, 'payload.gender', '');
            const businessTypeList = _.get(request, 'payload.businessTypeList', '');
            const openingHours = _.get(request, 'payload.openingHours', '');
            var address = _.get(request, 'payload.address', '');
            const deviceToken = _.get(request, 'payload.deviceToken', '');
            const deviceType = _.get(request, 'payload.deviceType', '');
            const loginType = _.get(request, 'payload.loginType', '');
            const latitude = _.get(payload, "address.latitude", '');
            const longitude = _.get(payload, "address.longitude", '');
            if (latitude != '' && longitude != '') {
                // console.log('enter');
                var location = {
                    type: "Point",
                    coordinates: []
                }
                location.coordinates.push(parseFloat(longitude));
                location.coordinates.push(parseFloat(latitude));
            } else {
                var location = {
                    type: "Point",
                    coordinates: [0.0, 0.0]
                }
            }

            const FBID = _.get(request, 'payload.FBID', '');
            var businessTypeListArray = [];
            for (var i = 0; i < businessTypeList.length; i++) {
                businessTypeListArray.push(businessTypeList[i]);
            }
            var openingHoursArray = [];
            // for(var i=0;i<openingHours.length;i++){
            //     openingHoursArray.push(openingHours[i]);
            // }
            var myOpeningHoursArray = [];
            // console.log(openingHours.length);
            for (var i = 0; i < openingHours.length; i++) {
                openingHoursArray.push(openingHours[i]);
                var o = openingHours[i].split('|')
                // console.log(o);
                // console.log(o.length)
                var openingData = await OpeningHours.findOne({
                    _id: o[0]
                }, {
                    dayName: 1
                })
                if (o.length == 2) {
                    var openingObject = {
                        openiningId: o[0],
                        dayName: openingData.dayName,
                        status: "closed"
                    }
                    myOpeningHoursArray.push(openingObject);
                } else {
                    var openingObject = {
                        openiningId: o[0],
                        dayName: openingData.dayName,
                        startTime: o[1],
                        endTime: o[2],
                        status: "opened",
                    }
                    myOpeningHoursArray.push(openingObject);
                }
            }
            if (address == '') {
                var address = {
                    streetAddress: "",
                    apartmentNumber: 0,
                    state:'',
                    city: "",
                    zipCode: "",
                    latitude: "",
                    longitude: ""
                }
            }
            const userPayload = {
                name: name,
                email: email,
                password: hashPassword,
                address: address,
                userType: userType,
                aboutBusiness: aboutBusiness,
                specialOfferDeals: specialOfferDeals,
                subscriptionId: subscriptionId,
                businessTypeList: businessTypeListArray,
                deviceToken: deviceToken,
                deviceType: deviceType,
                loginType: loginType,
                FBID: FBID,
                associateWith: associateWith,
                images: images,
                userImage: imageUrl,
                location: location,
                chatUserId: chatUserId,
                myOpeningHoursArray: myOpeningHoursArray,
                openingHours: openingHoursArray
            }
            const userSave = await new Users(userPayload);
            const data1 = await userSave.save();
            if (data1) {
                var userId = data1._id;
                // console.log(address);
                if (userType == "business" || userType == "Business") {
                    var payloadBusinessData = {
                        businessID: userId
                    }
                    var objectData = new BusinessOwner(payloadBusinessData);
                    await objectData.save();
                }
                // const serviceTypeList = _.get(request, "payload.serviceTypeList", '');
                // const serviceCategoryName = _.get(serviceTypeList, "serviceCategoryName", '');
                // const serviceCategoryId = _.get(serviceTypeList, "serviceCategoryId", '');
                // const duration = _.get(serviceTypeList, "duration", '');
                // const price = _.get(serviceTypeList, "price", '');
                // const extraCharge = _.get(serviceTypeList, "extraCharge", '');
                // const serviceName = _.get(serviceTypeList, "serviceName", '');
                // if (price) {
                //     var price1 = price
                // } else {
                //     var price1 = 0
                // }
                // if (extraCharge) {
                //     var extraCharge1 = extraCharge
                // } else {
                //     var extraCharge1 = 0
                // }
                // const serviceData = {
                //     userId: userId,
                //     gender: serviceTypeList.gender,
                //     serviceCategoryId: serviceCategoryId,
                //     serviceCategoryName: serviceCategoryName,
                //     serviceName: serviceName,
                //     duration: duration,
                //     price: price1,
                //     extraCharge: extraCharge1
                // }

                // const serviceSave = await new Services(serviceData);
                // const serviceSaveData = await serviceSave.save();

                if (true) {
                    // const serviceId = serviceSaveData._id;
                    const user = await Users.findOne({
                        _id: userId
                    })
                    var serviceData=await TempServices.findOne({email:email});
                    if (serviceData) {
                        var serviceIds=serviceData.serviceIds
                        for(var i=0;i<serviceIds.length;i++){
                            // console.log('enter',serviceIds[i])
                        user.serviceTypeList.push(serviceIds[i]);
                        // if ("""") {
                        var serviceDetails=await Services.findOne({_id:serviceIds[i]});
                        if(serviceDetails){
                            // console.log('enter2',serviceDetails.serviceCategoryId)
                        user.serviceCategoryId.push(serviceDetails.serviceCategoryId);
                        }else{
                            console.log('no service details')
                        }
                       // user.serviceCategoryId = serviceCategoryId[i];
                        await user.save();   
                        }
                    }
                    const userData = await Users.findOne({
                        _id: userId
                    }, {
                        myOpeningHoursArray: 0
                    }).populate('serviceTypeList');
                    const token = Helpers.createJwt(userSave);
                    userData.token = token;
                    userData.ratingAvg = 0;
                    console.log("subscriptionId",subscriptionId);
                    if (subscriptionId) {
                        // console.log('enter');
                        const SubscriptionId = userData.subscriptionId;
                        const subscriptionData = await SubscriptionPlan.findOne({
                            _id: SubscriptionId
                        });
                        if(subscriptionData){
                        // console.log("subscriptionData:",subscriptionData)
                        if(subscriptionData.planName=="free" || subscriptionData.planName=="Free"){
                        const currencyType = subscriptionData.currencyType;
                        const price = subscriptionData.price;
                        const days = subscriptionData.days;
                        userData.subsRemainingDays = days;
                        
                        var startDate = new Date();
                        Date.prototype.addDays = function(days) {
                            var date = new Date(this.valueOf());
                            date.setDate(date.getDate() + days);
                            return date;
                        }

                        const endDate = startDate.addDays(parseInt(days));
                        var yyyy = startDate.getFullYear();
                        var mm = startDate.getMonth();
                        var m1 = mm + 1;
                        if (m1 > 0 && m1 < 10) {
                            m1 = "0" + m1;
                        }
                        var dd = startDate.getDate()
                        if (dd > 0 && dd < 10) {
                            dd = "0" + dd;
                        }
                        var today = yyyy + '-' + m1 + '-' + dd;
                        var yyyy = endDate.getFullYear();
                        var mm = endDate.getMonth();
                        var m1 = mm + 1;
                        if (m1 > 0 && m1 < 10) {
                            m1 = "0" + m1;
                        }
                        var dd = endDate.getDate()
                        if (dd > 0 && dd < 10) {
                            dd = "0" + dd;
                        }
                        // console.log("date1",endDate)
                        var endDate = yyyy + '-' + m1 + '-' + dd;
                        // console.log("date",endDate);
                        userData.subscriptionName=subscriptionData.planName;
                        var planName=userData.subscriptionName;
                        var planDisplayName=subscriptionData.planDisplayName;
                        if(planName.toLowerCase()=="free"){
                            var isFree=1
                            var paymentStatus=1
                        }else{
                            var isFree=0
                            var paymentStatus=0
                        }
                        userData.subscriptionEndDate=endDate;
                        const SubscriptionHistoryPayload = {
                            subscriptionId: SubscriptionId,
                            currencyType: currencyType,
                            userId: userId,
                            price: price,
                            startDate: today,
                            endDate: endDate,
                            totalDays: days,
                            isFree:isFree,
                            paymentStatus:paymentStatus,
                            planDisplayName:planDisplayName,
                            remainingDays: days
                        }
                        const subscriptionHistorySave = await new SubscriptionHistory(SubscriptionHistoryPayload);
                        const data = await subscriptionHistorySave.save();
                        console.log("subscriptionData",data);
                        if (subscriptionHistorySave) {
                            const subscriptionHistoryId = subscriptionHistorySave._id;
                            var startTime = setInterval(async function() {
                                // console.log("subscriptionHistoryId:", subscriptionHistoryId);
                                const id = subscriptionHistoryId;
                                const subscriptionHistoryData = await SubscriptionHistory.findOne({
                                    _id: id
                                });
                                var remainingDays = subscriptionHistoryData.remainingDays;
                                var newRemainigDays = parseInt(remainingDays) - 1;
                                const remainingDaysUpdate = await SubscriptionHistory.findOneAndUpdate({
                                    _id: id
                                }, {
                                    $set: {
                                        remainingDays: String(newRemainigDays)
                                    }
                                }, {
                                    new: true
                                });
                                if (newRemainigDays == 0) {
                                    var status = 0;
                                    // console.log("end date=>>>>>>>>>>>>>>>>>>>>>>>>>>")
                                    const statusUpdate = await SubscriptionHistory.findOneAndUpdate({
                                        _id: id
                                    }, {
                                        $set: {
                                            status: status
                                        }
                                    }, {
                                        new: true
                                    });
                                    clearInterval(startTime)
                                }
                            }, 1440000)
                        }
                    }
                }
            }
                    userData.reviewCount = 0;
                    return reply({
                        status: true,
                        message: 'User successfully registered.',
                        data: userData
                    })
                }
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
    path: '/user/signup',
    config: {
        tags: ['api', 'users'],
        description: 'Create Barber Business Account.',
        notes: ['On success'],
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().optional(),
                userType: Joi.string().optional(),
                address: {
                    streetAddress: Joi.string().optional(),
                    apartmentNumber: Joi.any().optional(),
                    city: Joi.string().optional(),
                    zipCode: Joi.string().optional(),
                    latitude: Joi.string().optional(),
                    longitude: Joi.string().optional(),
                    state:Joi.string().optional()
                },
                // address:Joi.any().optional(),
                images: Joi.array().optional(),
                aboutBusiness: Joi.string().optional(),
                specialOfferDeals: Joi.any().optional(),
                associateWith: Joi.string().optional(),
                businessTypeList: Joi.array().optional(),
                // serviceTypeList: {
                //     gender: Joi.any().optional(),
                //     serviceCategoryId: Joi.any().optional(),
                //     serviceCategoryName: Joi.any().optional(),
                //     serviceName: Joi.string().optional(),
                //     duration: Joi.any().optional(),
                //     price: Joi.any().optional(),
                //     extraCharge: Joi.any().optional()
                // },
                userImage: Joi.any().optional(),
                subscriptionId: Joi.string().optional(),
                deviceToken: Joi.string().optional(),
                deviceType: Joi.string().optional(),
                loginType: Joi.string().optional(),
                FBID: Joi.string().optional(),
                openingHours: Joi.array().optional()
            }
        },
        handler
    }
}


export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}