import createUser from './handlers/registerUser';
import loginUser from './handlers/loginUser';
import forgotPassword from './handlers/forgotPassword';
import getMe from './handlers/getMe';
import editProfile from './handlers/editProfile';
import changePassword from './handlers/changePassword';
import getBarberReview from './handlers/getBarberReview';
import editRatingAndReview from './handlers/editRatingAndReview'
import deleteRatingAndReview from './handlers/deleteRatingAndReview'
import getAddress from './handlers/getAddress';
import editAddress from './handlers/editAddress';
import createChatRoom from './handlers/createChatRoom';
import getAllStates from './handlers/getAllStates';

exports.register=(server,options,next)=>{
	createUser(server,options)
	loginUser(server,options)
	forgotPassword(server,options)
	getMe(server,options)
	editProfile(server,options)
	changePassword(server,options)
	getBarberReview(server,options)
	editRatingAndReview(server,options)
	deleteRatingAndReview(server,options)
	getAddress(server,options)
	editAddress(server,options)
	createChatRoom(server,options)
	getAllStates(server,options)
	next();
}
exports.register.attributes={
	name:'custumerUsers'
}
