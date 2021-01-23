import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import BusinessType from '../../models/businessType';
import OpeningHours from '../../models/openingHours';
let defaults = {};
/**
Api to getOpeningHours. 
  **/
const handler = async (request, reply) => {
    try {
        const payload=request.payload;
        const userType=_.get(request,"payload.userType",'');
            // const data={dayName:"Monday" ,startTime:"10:00",endTime:"19:00",status:"Opened"}
            // const data={dayName:"Monday" ,startTime:"10:00",endTime:"19:00",status:"Opened"}
            // const data={dayName:"Monday" ,startTime:"10:00",endTime:"19:00",status:"Opened"}
            // const data={dayName:"Monday" ,startTime:"10:00",endTime:"19:00",status:"Opened"}
            // const data={dayName:"Monday" ,startTime:"10:00",endTime:"19:00",status:"Opened"}
            // const data={dayName:"Monday" ,startTime:"10:00",endTime:"19:00",status:"Opened"}
            // const data={dayName:"Saturday" ,startTime:"",endTime:"",status:"Closed"}
            
            // const obj= await new OpeningHours(data);
            // await obj.save();
        const OpeningHoursData=await OpeningHours.find({});    
        // console.log(BusinessTypeData);
        if(OpeningHoursData.length > 0){
            return reply({
                status:true,
                message:"Get all opening hours.",
                data:OpeningHoursData
            })
        }else{
            return reply({
                status:false,
                message:"Not Found.",
                data:{}
            })
        }
        
    } catch (error) {
        console.log(error.message);
        return reply({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

const routeConfig = {
    method: 'GET',
    path: '/admin/getOpeningHours',
    config: {
        tags: ['api', 'users'],
        description: 'Get all opening hours.',
        notes: ['On success'],
        // validate: {
        //     payload: {
        //         userType: Joi.string().required(),
        //     }
        // },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}