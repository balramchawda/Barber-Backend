import Hoek from 'hoek'
import Joi from 'joi'

import Helpers from '../../helpers'
import Users from '../../models/users'

import SubscriptionHistory from '../../models/userSubscriptionHistory'
import AwsServices from '../../config/file_upload';
const uniqid = require('uniqid');

let defaults = {}

/*
 * API to addNewFile
 **/
const handler = async (request, reply) => {
    console.log(request.file);
    try {
        // console.log(request.payload)
        const id = await Helpers.extractUserId(request)
        const user = await Users.findOne({
            _id: id
        }).lean();
        if (user) {
        var payload=request.payload;
           console.log(payload);
            if(payload.image){
            var file=payload.image;
                let encoded = file.toString().replace(/^data:(.*,)?/, "");
                if (encoded.length % 4 > 0) {
                encoded += "=".repeat(4 - (encoded.length % 4));
                }
                var buf = new Buffer(file, 'base64');
                const imageUrl=await AwsServices.upload("workPlace.png",buf);
                var imageArray=user.images;
                Array.prototype.insert = function ( index, item ) {
                this.splice( index, 0, item );  
                };
                var data= {
                    id:uniqid()+String(Date.now()),
                    imageUrl:imageUrl
                }
                
                imageArray.insert(0,data);
                // imageArray.push(data);
                await Users.findOneAndUpdate({_id:id},{$set:{images:imageArray}},{new:true});
                return reply({
                    status:true,
                    message:"Uploaded image successfully.",
                    // imageUrl:imageUrl,
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
    method: 'POST',
    path: '/user/addNewFileUpload',
    config: {
        auth:'jwt',
        // payload: {
        //     output: 'stream',
        //     parse: true,
        //     allow: 'multipart/form-data'
        // },
        
        tags: ['api', 'me'],
        description: 'Returns a user object based on JWT along with a new token.',
        notes: [],
        validate:{
            payload:{
                image:Joi.any().optional()
            }
        },
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts)
    server.route(routeConfig)
}