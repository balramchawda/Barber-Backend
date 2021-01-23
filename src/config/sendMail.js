const nodemailer = require('nodemailer');
class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.MAILER_SERVICE,               //name of email provider
            // service:"gmail",
            auth: {
                user: process.env.MAILER_USER,       // sender's gmail id
                pass: process.env.MAILER_PASS     // sender password
                // user:"balramchawda4019@gmail.com",
                // pass:"natasha%123"
            }
        });
        this.mailOptions = {
            // from: "balramchawda4019@gmail.com"                // sender's gmail
            from: process.env.ADMIN_EMAIL                   // sender's gmail
        };
    }

    send(to_email, subject, html, next) {
        if (process.env.MAILER == "false") {
            return next("no error", "No Info");
        }
        this.mailOptions.to = to_email;
        this.mailOptions.subject = subject;
        this.mailOptions.html = html;
        this.transporter.sendMail(this.mailOptions, function (error, info) {
            if (error) {
                console.log("error is mail sending", error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            next(error, info);
        });
    }

}

module.exports = Mailer;

