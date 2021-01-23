import booking from '../models/booking';
import Barber from '../models/users';
import _ from 'lodash';
import BarberUser from '../models/users';
import socketcheck from './handlers/socketcheck';
import trackMe from './handlers/trackMe';
import {ObjectID} from 'mongodb';
exports.register=(server,options,next)=>{
	var io=require('socket.io')(server.listener);
	io.on('connection',function(socket){
		// console.log(socket);
		socket.on('updateLatLong',async function(data){
			// console.log(data);
			const bookingId=data.bookingId;
			const latitude=data.latitude;
			const longitude=data.longitude;
			const barberId=data.barberId;
			// console.log(barberId);
			const newvalue=ObjectID(barberId);
			// console.log(newvalue);
			const liveLocation={
				type:"Point",
				coordinates:[]
			}
            liveLocation.coordinates.push(parseFloat(longitude));
            liveLocation.coordinates.push(parseFloat(latitude));
            const updateData=await Barber.findOneAndUpdate({_id:newvalue},{$set:{barberLiveLatitude:latitude,barberLiveLongitude:longitude,liveLocation:liveLocation}},{new:true});
			if(updateData){
				console.log('updated lat long');
			}		
		})
		socket.on('trackMe',async function(data){
			const latitude = data.latitude;
            const longitude = data.longitude;
            const barberId=data.barberId;
            const newValue=ObjectID(barberId);
            const query = [{
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    key: "liveLocation",
                    distanceField: 'distance',
                    maxDistance: 10000,
                    spherical: true,

                }
            },{
                $match:{
                    _id:{$eq:newValue}
                }
            },
            {
                $project:{
                    barberLiveLatitude:1,
                    barberLiveLongitude:1,
                    distance:1
                }
            }]
            const data1 = await BarberUser.aggregate(query);
            socket.emit('trackMe',data1[0]);		
		})
	})
	socketcheck(server, options);
	trackMe(server,options);
    next();
}

exports.register.attributes={
	name:"socketConnection"
}