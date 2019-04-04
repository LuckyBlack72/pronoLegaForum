var nodeMailer = require('nodemailer');
var dbCallClassifica = require('../dbModule/dbManagerClassifica');

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

function notifyUpdateClassfica(stagione) {

    dbCallClassifica.getEmailAddressPartecipanti(stagione).then(function(emailAddress){ //torna una promise
        
        const oggi = new Date();
        const dateString = 
        (oggi.getDate() > 9 ? oggi.getDate() : '0' + oggi.getDate()) +
        '/' + 
        ((oggi.getMonth() + 1) > 9 ? (oggi.getMonth() + 1) : '0' + (oggi.getMonth() + 1)) +
        '/' + 
        oggi.getFullYear();
        
        let recipients = [];
        for( let i = 0; i < emailAddress.length; i++){
            if (!stringIsNullOrWhiteSpace(emailAddress[i].email_address)){
                recipients.push(emailAddress[i].email_address);
            }
        }

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
        bcc: recipients, // list of receivers in bcc
        subject: 'Notifica Aggiornamento Classifica al ' + dateString, // Subject line
        text: 'La classfica generale è stata aggiornata al ' + dateString, // plain text body
        html: '<b>' + 'La classfica generale è stata aggiornata al ' + dateString + '</b>', // html body
        attachments: []
        };        

        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {
                console.log(error);
            }else{
                console.log('Message %s sent: %s', info.messageId, info.response);
            }
        
        });        
      
    })
    .catch(error => { //gestione errore
    
        console.log(error);
    
    });

}

function sendRecoverPasswordEmail(user, email, dummyPassword) {

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
      to: email, // list of receivers
      subject: user +  ' : ' + 'Recupero Password', // Subject line
      text: user + ' ' + ' la password temporanea del tuo account è : ' + dummyPassword + ' , modificala al più presto nel tuo profilo' , // plain text body
      html: '<b>' + user + ' ' + ' la password temporanea del tuo account è : ' + dummyPassword + ' , modificala al più presto nel tuo profilo' + '</b>', // html body
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

function stringIsNullOrWhiteSpace(str) {
    return (!str || str.length === 0 || /^\s*$/.test(str));
}

module.exports = {

    notifyInsertedProno,
    notifyUpdateClassfica,
    sendRecoverPasswordEmail

};
  