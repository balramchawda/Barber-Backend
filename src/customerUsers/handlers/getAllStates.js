import Hoek from 'hoek'
import Joi from 'joi';
import Helpers from '../../helpers'
import _ from 'lodash';
import States from '../../models/states';
import customerUsers from '../../models/customerUser';
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
      // var data = [{country:"India",state:"Andhra Pradesh",shortName:"AP"},{country:"India",state:"Arunachal Pradesh",shortName:"AR"},{country:"India",state:"Assam",shortName:"AS"},{country:"India",state:"Bihar",shortName:"BR"},{country:"India",state:"Chhattisgarh",shortName:"CG"},{country:"India",state:"Goa",shortName:"GA"},{country:"India",state:"Gujarat",shortName:"GJ"},{country:"India",state:"Haryana",shortName:"HR"},{country:"India",state:"Himachal Pradesh",shortName:"HP"},{country:"India",state:"Jammu and Kashmir",shortName:"JK"},{country:"India",state:"Jharkhand",shortName:"JH"},{country:"",state:"Karnataka",shortName:"KA"},{country:"India",state:"Kerala",shortName:"KL"},{country:"India",state:"Madhya Pradesh",shortName:"MP"},{country:"India",state:"Maharashtra",shortName:"MH"},{country:"India",state:"Manipur",shortName:"MN"},{country:"India",state:"Meghalaya",shortName:"ML"},{country:"India",state:"Mizoram",shortName:"MZ"},{country:"India",state:"Nagaland",shortName:"NL"},{country:"India",state:"Orissa",shortName:"OR"},{country:"India",state:"Punjab",shortName:"PB"},{country:"India",state:"Rajasthan",shortName:"RJ"},{country:"India",state:"Sikkim",shortName:"SK"},{country:"India",state:"Tamil Nadu",shortName:"TN"},{country:"India",state:"Tripura",shortName:"TR"},{country:"India",state:"Uttarakhand",shortName:"UK"},{country:"India",state:"Uttar Pradesh",shortName:"UP"},{country:"India",state:"West Bengal",shortName:"WB"},{country:"India",state:"Tamil Nadu",shortName:"TN"},{country:"India",state:"Tripura",shortName:"TR"},{country:"India",state:"Chandigarh",shortName:"CH"},{country:"India",state:"Delhi",shortName:"DL"}]
//       var data = [
// {country:"USA",state:"Alabama",shortName:"AL"},{country:"USA",state:"Alaska",shortName:"AK"},
// {country:"USA",state:"Arizona",shortName:"AZ"},{country:"USA",state:"Arkansas",shortName:"AR"},
// {country:"USA",state:"California",shortName:"CA"},{country:"USA",state:"Colorado",shortName:"CO"},
// {country:"USA",state:"Connecticut",shortName:"CT"},{country:"USA",state:"Delaware",shortName:"DE"},
// {country:"USA",state:"Florida",shortName:"FL"},{country:"USA",state:"Georgia",shortName:"GA"},
// {country:"USA",state:"Hawaii",shortName:"HI"},{country:"USA",state:"Idaho",shortName:"ID"},
// {country:"USA",state:"Illinois",shortName:"IL"},{country:"USA",state:"Indiana",shortName:"IN"},
// {country:"USA",state:"Iowa",shortName:"IA"},{country:"USA",state:"Kansas",shortName:"KS"},
// {country:"USA",state:"Kentucky",shortName:"KY"},{country:"USA",state:"Louisiana",shortName:"LA"},
// {country:"USA",state:"Maine",shortName:"ME"},{country:"USA",state:"Maryland",shortName:"MD"},
// {country:"USA",state:"Massachusetts",shortName:"MA"},{country:"USA",state:"Michigan",shortName:"MI"},
// {country:"USA",state:"Minnesota",shortName:"MN"},{country:"USA",state:"Mississippi",shortName:"MS"},
// {country:"USA",state:"Missouri",shortName:"MO"},{country:"USA",state:"Montana",shortName:"MT"},
// {country:"USA",state:"Nebraska",shortName:"NE"},{country:"USA",state:"Nevada",shortName:"NV"},
// {country:"USA",state:"New Hampshire",shortName:"NH"},{country:"USA",state:"New Jersey",shortName:"NJ"},
// {country:"USA",state:"New Mexico",shortName:"NM"},{country:"USA",state:"New York",shortName:"NY"},
// {country:"USA",state:"North Carolina",shortName:"NC"},{country:"USA",state:"North Dakota",shortName:"ND"},
// {country:"USA",state:"Ohio",shortName:"OH"},{country:"USA",state:"Oklahoma",shortName:"OK"},
// {country:"USA",state:"Oregon",shortName:"OR"},{country:"USA",state:"Pennsylvania",shortName:"PA"},
// {country:"USA",state:"Rhode Island",shortName:"RI"},{country:"USA",state:"South Carolina",shortName:"SC"},
// {country:"USA",state:"South Dakota",shortName:"SD"},{country:"USA",state:"Tennessee",shortName:"TN"},
// {country:"USA",state:"Texas",shortName:"TX"},{country:"USA",state:"Utah",shortName:"UT"},
// {country:"USA",state:"Vermont",shortName:"VT"},{country:"USA",state:"Virginia",shortName:"VA"},
// {country:"USA",state:"Washington",shortName:"WA"},{country:"USA",state:"West Virginia",shortName:"WV"},
// {country:"USA",state:"Wisconsin",shortName:"WI"},{country:"USA",state:"Wyoming",shortName:"WY"}
// ]
//         for(var i=0;i<data.length;i++){
//             var payload=data[i];
//             var obj=await new States(payload);
//             await obj.save();
//         }
        // var stateData=await States.find({country:request.payload.country});
        var stateData=await States.find({country:"USA"});

        return reply({
            status:true,
            message:"Get All States",
            data:stateData
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
    method: 'GET',
    path: '/allUsers/getAllStates',
    config: {
        tags: ['api', 'users'],
        description: 'Update profile.',
        notes: ['On success'],
        // validate: {
        //     payload: {
        //         country: Joi.string().optional(),
        //         // phone: Joi.string().optional(),
        //         // gender: Joi.string().optional(),
        //         // age: Joi.string().optional(),
        //         // userImage: Joi.any().optional()
        //     }
        // },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}