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

const generateOfferBody = ({ name, email, notes }) => {
    return `
                <p><b>Ad,Soyad:</b>${name}</p>
                <p><b>E-poçt:</b><a href="mailto:${email}">${email}</a></p>
                <p><b>Qeydlər:</b>${notes}</p>
            `
}
const generateContactBody = ({ name, email, phone, head, notes }) => {
    return `
                <p><b>Ad,Soyad:</b>${name}</p>
                <p><b>E-poçt:</b><a href="mailto:${email}">${email}</a></p>
                <p><b>Telefon:</b>${phone}</p>
                <p><b>Başlıq:</b>${head}</p>
                <p><b>Qeydlər:</b>${notes}</p>
            `
}
const generateOrderBody = ({ id, name, phoneNum, email, address, notes, orders }) => {
    var orderStr = `
        <p><b>Sifariş verilən məhsullar</b></p><br>
        <table style="width:50%;text-align:left;border: 1px solid black; border-collapse:collapse;">
        <tr>
            <th style="border: 1px solid black; border-collapse:collapse;">Ad</th>
            <th style="border: 1px solid black; border-collapse:collapse;">Kod</th>
        </tr>
    `
    for (var i = 0; i < orders.length; i++) {
        orderStr += `
        <tr>
            <td style="border: 1px solid black; border-collapse:collapse;">${orders[i].name}</td>
            <td style="border: 1px solid black; border-collapse:collapse;">${orders[i].code}</td>
        </tr>
        `
    }
    orderStr += `</table>`
    return `
                <p style="color:grey"><b>ID:</b>${id}</p>
                <p><b>Ad,Soyad:</b>${name}</p>
                <p><b>Telefon nömrəsi:</b>${phoneNum}</p>
                <p><b>E-poçt:</b><a href="mailto:${email}">${email}</a></p>
                <p><b>Ünvan:</b>${address}</p>
                <p><b>Qeydlər:</b>${notes}</p><br>
            `+ orderStr
}
module.exports = { sendMail, generateOfferBody, generateOrderBody, generateContactBody }