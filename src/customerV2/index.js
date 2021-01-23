import getAllBarber from './handlers/getAllBarberByLatLong';
import confirmArrival from './handlers/confirmArrival';
import workCompleted from './handlers/workCompleted';
import getAllServices from './handlers/getAllServices';
import getBookingData from './handlers/getBookingData';

exports.register=(server,options,next)=>{
	getAllBarber(server,options)
	getAllServices(server,options)
	confirmArrival(server,options)
	workCompleted(server,options)
	getBookingData(server,options)
	next();
}
exports.register.attributes={
	name:'custumerv2'
}
