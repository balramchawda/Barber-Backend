import Hoek from 'hoek'
import Joi from 'joi'
import _ from 'lodash'
import Helpers from '../../helpers'
import Users from '../../models/users'
import Services from '../../models/serviceDetails'
import Bookings from '../../models/booking'
import TempService from '../../models/storeTemporyServices'
import ObjectID from 'mongodb';
let defaults = {}
/*
 * API to getAllServices
 **/
const handler = async (request, reply) => {
    try {
        // const id = await Helpers.extractUserId(request)
        const email=_.get(request,'payload.email','');
        const data = await TempService.findOne({
            email:email
        })

        if (data) {
            var serviceId=_.get(request,'payload.serviceId','');
            // if(serviceId){
            //     var newServiceId=ObjectID(serviceId);
            // }
            // var serviceArray=data.serviceIds
            // console.log('enter1',serviceArray.length)
            // var newArray=[];
            // for(var i=0;i<serviceArray.length;i++){

            //     if(serviceArray[i]!=newServiceId){
            //         newArray.push(serviceArray[i]);
            //     }else{
            //         console.log('success')
            //     }

            // }
            // await TempService.findOneAndUpdate({email:email},{$set:{serviceIds:newArray}},{new:true});
            // const user = await Users.findOne({
            // email:email
            // })
            // if(user){
            // var serviceArray1=user.serviceTypeList
            // console.log('enter2',serviceArray1.length)
            // var newArray=[];
            // for(var i=0;i<serviceArray1.length;i++){
            //     if(serviceArray1[i]!=newServiceId){
            //         newArray.push(serviceArray1[i]);
            //     }else{
            //         console.log('success2')

            //     }
            // }
            // await Users.findOneAndUpdate({email:email},{$set:{serviceIds:newArray}},{new:true});
            // }
            var BookingData=await Bookings.find({});
            for(var i=0;i<BookingData.length;i++){
                var services=BookingData[i].serviceId;
                for(var j=0;j<services.length;j++){
                    if(serviceId==services[j]){
                        return reply({
                            "status":false,
                            "message":"You can't delete this service because someone have booked with this service."
                        })
                    }
                }
            }
            await Services.remove({_id:serviceId})
            return reply({
                status:true,
                message:"Deleted service",
                // data:user
            })   
        }else{
            return reply({
                status:false,
                message:"No data found",
                data:{}
            })
        }

        // user.locations = await Location.find({ userId: id })

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
    path: '/user/deleteServiceById',
    config: {
        tags: ['api', 'me'],
        description: 'Returns a user object based on JWT along with a new token.',
        notes: [],
        validate:{
            payload:{
                email:Joi.string().optional(),
                serviceId:Joi.string().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}