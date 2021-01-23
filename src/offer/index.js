import addNewOffer from './handlers/addNewOffer';

exports.register = (server, options, next) => {
  addNewOffer(server, options)
  next()
}

exports.register.attributes = {
  name: 'offer'
}