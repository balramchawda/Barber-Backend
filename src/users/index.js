import GetMyOpeningHours from './handlers/getMyOpeningHours';
import createUser from './handlers/registerUser';
import getMe from './handlers/get_me'
import loginUser from './handlers/loginUser';
import forgotPassword from './handlers/forgotPassword';
import addNewService from './handlers/addNewService';
import getMySubscriptionHistory from './handlers/getMySubscriptionHistory';
import getMyReviewAndRatingList from './handlers/getMyReviewAndRating';
import outOfWork from './handlers/outOfWork';
import editProfile from './handlers/editProfile';
import GetAllBusinessBarberList from './handlers/getAllBusinessBarberList';
import AssociateWithBusiness from './handlers/associateWithBusiness';
import EditOpeningHours from './handlers/editOpeningHours';
import UploadFile from './handlers/uploadFile';
import CheckEmail from './handlers/checkEmail';
import GetAllWorkplaceImages from './handlers/getAllWorkplaceImages';
import DeleteWorkplaceImage from './handlers/deleteWorkplaceImage';
import AddNewFileUpload from './handlers/addNewFileUpload'
import AddNewServiceAccount from './handlers/addNewServiceAccount';
import GetServices from './handlers/getServices'
import DeleteServiceByid from './handlers/deleteServiceByid';
import EditServiceById from './handlers/editServiceById';
import AddPayment from './handlers/addPayment';
import getAllSubscriptionAccount from './handlers/getAllSubscriptionAccount'
import getMyCurrentSubscriptionPlan from './handlers/getMyCurrentSubscriptionPlan'
import getTimeSlot from './handlers/getTimeSlot'
import changePassword from './handlers/changePassword'

exports.register = (server, options, next) => {
  createUser(server, options)
  getMe(server, options)
  forgotPassword(server,options)
  loginUser(server,options)
  addNewService(server,options)
  getMySubscriptionHistory(server,options)
  getMyReviewAndRatingList(server,options)
  outOfWork(server,options)
  editProfile(server,options)
  GetAllBusinessBarberList(server,options)
  AssociateWithBusiness(server,options)
  GetMyOpeningHours(server,options);
  EditOpeningHours(server,options)
  UploadFile(server,options)
  CheckEmail(server,options)
  GetAllWorkplaceImages(server,options)
  DeleteWorkplaceImage(server,options)
  AddNewFileUpload(server,options)
  AddNewServiceAccount(server,options)
  GetServices(server,options)
  DeleteServiceByid(server,options)
  EditServiceById(server,options)
  AddPayment(server,options)
  getMyCurrentSubscriptionPlan(server,options)
  getAllSubscriptionAccount(server,options)
  getTimeSlot(server,options)
  changePassword(server,options)
  next()
}

exports.register.attributes = {
  name: 'users'
}