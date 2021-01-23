import AWS from 'aws-sdk'
import config from '../config'

AWS.config.update({
  accessKeyId: config.get('/aws').AWS_KEY_ID,
  secretAccessKey: config.get('/aws').AWS_SECRET_KEY
})

const s3 = new AWS.S3({
  params: {
    Bucket: config.get('/aws').BUCKET_NAME
  }
})

class AwsService {
  uploadImage(filename, data, type) {
    return new Promise((resolve, reject) => {
      s3.upload({
        Body: data,
        Key: type + '/' + filename,
        ACL: 'private',
        ContentType: 'image/jpeg'
      }, (err, data) => {
        if (err) {
          console.log(err);
          reject(err)
        } else {
          console.log(data.Location);
          resolve(data.Location)
        }
      })
    })
  }
}

export default AwsService