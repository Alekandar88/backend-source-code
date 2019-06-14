const nodemailer = require('nodemailer');

exports.sendEmail = function (req, res, next) {
    //Extract the from to subject and email body from the request
    const {from, to, subject, body} = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'firestoreangular0@gmail.com',
        }
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            next(error)
        } else {

            console.log('Email sent: ' + info.response);
            res.status(200).send({
                "success": true,
                "message": "Email successfully sent!",
            })
        }
    });
};
