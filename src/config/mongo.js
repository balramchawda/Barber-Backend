import dotenv from 'dotenv'
/*
 * Fly Friends MongoDB Connection string define here
 **/
dotenv.config()
const mongo = {}
mongo.url = {
  $filter: 'env',
  'development': process.env.MONGODB_URI || 'mongodb://localhost:27017/Barber',
  'test': process.env.MONGODB_URI || 'mongodb://localhost:27017/Barber',
  'sandbox': process.env.MONGODB_URI,
  'production': process.env.MONGODB_URI,
  $default: process.env.MONGODB_URI || 'mongodb://localhost:27017/Barber'
}

export default mongo