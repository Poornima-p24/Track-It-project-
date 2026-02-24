const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth: {
        user: 'spoornima4196@gmail.com',
        pass: 'fyci telr mdiv emho'
    }
});
let mailOptions = {
    from: 'spoornima4196@gmail.com',
    to: 'malavikhagopinath1970@gmail.com',
    subject: 'Node.js Mail',
    text: 'hello from node js'
};
transporter.sendMail(mailOptions,(err,info) => {
    if (err) console.log(err);
    else console.log('Email Sent');
});