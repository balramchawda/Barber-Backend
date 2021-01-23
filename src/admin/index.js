import GetBusinessTypeList from './handlers/getBusinessTypesList';
import GetServiceCategoryList from './handlers/getServiceCategoryList';
import GetSubscriptionPlans from './handlers/getSubscriptionPlans'
import GetOpeningHours from './handlers/getOpeningHours';
import UserRegister from './handlers/userRegister';
import UserLogin from './handlers/login';
import AdminRegister from './handlers/adminRegister';
import BarberRegister from './handlers/barberRegister';
import GetAdminDashboardData from './handlers/getAdminDashboardData';
import GetAllUsers from './handlers/getAllUsers';
import GetAllBarbers from './handlers/getAllBarbers';
import UpdateCustomerStatus from './handlers/updateCustomerStatus'
import UpdateBarberStatus from './handlers/updateBarberStatus'
import ForgotPassword from './handlers/forgotPassword'
import UpdatePassword from './handlers/updatePassword'
import GetAllCategory from './handlers/getAllCategory'
import AddServiceCategory from './handlers/addServiceCategory'
import GetAllCategoryAdmin from './handlers/getAllCategoryAdmin'
import UpdateCategoryStatus from './handlers/updateCategoryStatus'
import GetPaymentHistory from './handlers/getPaymentHistory'
import GetBarberById from './handlers/getBarberById'
import GetCustomerDetailsById from './handlers/getCustomerDetailsById'
import AddSubscription from './handlers/addSubscription'
import GetAllSubscriptionPlan from './handlers/getAllSubscriptionPlan'
import UpdateSubscriptionStatus from './handlers/updateSubscriptionStatus'
import UpdateSubscriptionDetails from './handlers/updateSubscriptionDetails'
import GetSubscriptionById from './handlers/getSubscriptionById'

exports.register = (server, options, next) => {
  GetBusinessTypeList(server, options)
  GetServiceCategoryList(server,options)
  GetSubscriptionPlans(server,options)
  GetOpeningHours(server,options)
  UserRegister(server,options)
  UserLogin(server,options)
  AdminRegister(server,options)
  BarberRegister(server,options)
  GetAdminDashboardData(server,options)
  GetAllUsers(server,options)
  GetAllBarbers(server,options)
  UpdateBarberStatus(server,options)
  UpdateCustomerStatus(server,options)
  ForgotPassword(server,options)
  UpdatePassword(server,options)
  GetAllCategory(server,options)
  AddServiceCategory(server,options)
  GetAllCategoryAdmin(server,options)
  UpdateCategoryStatus(server,options)
  GetPaymentHistory(server,options)
  GetBarberById(server,options)
  GetCustomerDetailsById(server,options)
  AddSubscription(server,options)
  GetAllSubscriptionPlan(server,options)
  UpdateSubscriptionStatus(server,options)
  GetSubscriptionById(server,options)
  UpdateSubscriptionDetails(server,options)
  next()
}

exports.register.attributes = {
  name: 'admin'
}