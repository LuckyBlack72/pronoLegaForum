var nodeMailer = require('nodemailer');

function notifyInsertedProno(user) {

    const mailServer = {
                        host: 'smtps.aruba.it',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'sorteggio@legaforum.com',
                            pass: 'provalf18'
                        }
    };

    const transporter = nodeMailer.createTransport(mailServer);
  
    const mailOptions = {
      from: '"Pronostici Lega Forum" <' + 'sorteggio@legaforum.com' + ' >', // sender address
      to: 'fantasportLB@gmail.com', // list of receivers
      subject: 'Notifica Inserimento / Modifica Pronostici', // Subject line
      text: user + ' Ha inserito/modificato Pronostici', // plain text body
      html: '<b>' + user + ' Ha inserito/modificato Pronostici' + '</b>', // html body
      attachments: []
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }else{
            console.log('Message %s sent: %s', info.messageId, info.response);
        }
    });

}

module.exports = {

    notifyInsertedProno

};
  