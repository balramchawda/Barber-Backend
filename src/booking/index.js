import getBarberList from './handlers/getBarberList';
import addReviewAndRating from './handlers/addRatingAndReview';
import getBarberCategoryList from './handlers/getBarberCategoryList';
import addFavourite from './handlers/addFavourite';
import getBarberProfileById from './handlers/getProfileByBarberId';
import booking from './handlers/bookNow';
import GetShortlistedServiceProvider from './handlers/getShortlistedServiceProvider';
import submitYourExp from './handlers/submitYourExp';
import getEarningList from './handlers/getEarningList';
import getMyBookings from './handlers/getMyBookings';
import cancelBooking from './handlers/cancelBooking';
import getAppointmentsList from './handlers/getAppointmentsList';
import cancelAppointment from './handlers/cancelAppointment';
import startJob from './handlers/startJob';
import completeAppointment from './handlers/completeAppointment';
import favAndUnFavImage from './handlers/addFavouriteImage';
import getProfileGallery from './handlers/getProfileGallery';
import getAppointmentsListByDate from './handlers/getAppointmentsListByDate';
import resetNotificationBatchCount from './handlers/resetNotificationBatchCount';

exports.register = (server, options, next) => {
  getBarberList(server, options)
  addReviewAndRating(server,options)
  getBarberCategoryList(server,options)
  addFavourite(server,options)
  getBarberProfileById(server,options)
  booking(server,options)
  GetShortlistedServiceProvider(server,options)
  submitYourExp(server,options)
  getEarningList(server,options)
  getMyBookings(server,options)
  cancelBooking(server,options)
  getAppointmentsList(server,options)
  cancelAppointment(server,options)
  startJob(server,options)
  completeAppointment(server,options)
  favAndUnFavImage(server,options)
  getProfileGallery(server,options)
  getAppointmentsListByDate(server,options)
  resetNotificationBatchCount(server,options)
  next()
}

exports.register.attributes = {
  name: 'booking'
}