import _ from 'lodash'
import config from '../config'

// const sendGrid = require('sendgrid')(config.get('/sendgrid').apiKey)
let sendGrid = require('@sendgrid/mail')
sendGrid.setApiKey(process.env.SEND_GRID)
const EmailService = {
    sendMail(email,callback)
		{
			var data={
	        	from : 'social@myskinuniverse.com',
	        	to : "balramchawda@linkites.com",
	        	subject :'Testing email',
	        	html: `Testing email`
	    	}
    	  sendGrid.send(data)
    .then(m => {
      console.log('Mail sent')
        callback(true)
    })
    .catch(error => {
      console.error(error.toString())
     callback(false)
    })
	}

}

module.exports = EmailService

// export default EmailService