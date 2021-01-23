var aws = require('aws-sdk'); // ^2.2.41
var multerS3 = require('multer-s3'); //"^1.4.1"

// Setting aws configurations 
aws.config.update({
    secretAccessKey: "06plNof5LkZRzE132h2CDVmAme6ZxgrlT4I+GoB9",
    accessKeyId: "AKIAI2EWRF2G77HWJZAQ",
    region: 'us-west-2'
});
// var s3 = new aws.S3();
// Decent bucket name
const bucketName = 'trim-app';
// Initiating S3 instance
const s3 = new aws.S3({
    apiVersion: '2012-10-17',
    params: {Bucket: bucketName}
});
// Options you can choose to set to accept files upto certain size limit
const options = {partSize: 10 * 1024 * 1024, queueSize: 1};
// The heart
// "Key" accepts name of the file, keeping it a timestamp for simplicity 
// "Body" accepts the file
export const upload=async (fileName,file)=>{
   const params = {Bucket: bucketName, Key:"trim-app"+"/"+`${Date.now().toString()}`+fileName, Body: file,ACL:'public-read'};
    let fileResp = null;
    await s3.upload(params, options).promise().then((res) => {
        fileResp = res;
    });
    return fileResp.Location;
};

export default {
upload
}
