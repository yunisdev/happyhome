var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = (to, subject, html) => {
    transporter.sendMail({ from: process.env.EMAIL, to, subject, html }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const generateOfferBody = ({name,email,notes}) => {
    return  `
                <p><b>Ad,Soyad:</b>${name}</p>
                <p><b>E-poçt:</b><a href="mailto:${email}">${email}</a></p>
                <p><b>Qeydlər:</b>${notes}</p>
            `
}
module.exports = { sendMail,generateOfferBody }