import _ from 'lodash';
import Hoek from 'hoek';
import Joi from 'joi';

/** 
Api to check socket.
**/

var defaults={};

const handler=async (request,reply)=>{
try{
reply.file('D:/balram/projects/linkites/Barber project/Barber/src/index.html');
}catch(error){
	reply({status:false,message:error.message})
}
}

const routeConfig={
	method: 'GET',
    path: '/updateLatLong',
    config: {
        tags: ['api', 'posts'],
        description: 'Check Socket connection.',
        notes: ['On success'],   
        handler
    }
}

export default (server, opts) => {
    defaults = Hoek.applyToDefaults(defaults, opts);
    server.route(routeConfig);
}
