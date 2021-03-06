var nodeMailer = require('nodemailer');
var dbCallClassifica = require('../dbModule/dbManagerClassifica');
var dbCallSchedine = require('../dbModule/dbManagerSchedineSettimanali');
var dbCallPartecipanti = require('../dbModule/dbManagerPartecipanti');

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

function notifyUserSchedineInsertedProno(request) {

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
    
    dbCallPartecipanti.getAnagraficaPartecipanti(request).then(function(userData){

        let mailBody = '';
        let mailBodyHtml = '';

        if (request.body.tipo_pronostici === 'E') {
            mailBody = 'Schedina N° ' + request.body.pronostici.settimana + ' - ' + 'Stagione : ' + request.body.pronostici.stagione + '\n\n';
            mailBodyHtml = '<b>' + 'Schedina N° ' + request.body.pronostici.settimana + ' - ' + 'Stagione : ' + request.body.pronostici.stagione + '</b>' + '<br><br>';            
        } else {
            mailBody = 'Schedina Lega Forum N° ' + request.body.pronostici.settimana + ' - ' + 'Stagione : ' + request.body.pronostici.stagione + '\n\n';
            mailBodyHtml = '<b>' + 'Schedina Lega Forum N° ' + request.body.pronostici.settimana + ' - ' + 'Stagione : ' + request.body.pronostici.stagione + '</b>' + '<br><br>';            
        }

        for (var i = 0; i < request.body.pronostici.pronostici.length; i++){
            mailBody += (i+1) + ' - ' + request.body.pronostici.pronostici[i] + ' : ' + request.body.pronostici.valori_pronostici[i] + '\n';
            mailBodyHtml += (i+1) + ' - ' + request.body.pronostici.pronostici[i] + ' : ' + request.body.pronostici.valori_pronostici[i] + '<br>';
        }

        const mailOptions = {
            from: '"Pronostici Lega Forum" <' + 'sorteggio@legaforum.com' + ' >', // sender address
            to: userData[0].email_address, // list of receivers
            subject: 'Notifica Inserimento / Modifica Pronostici', // Subject line
            text: mailBody, // plain text body
            html: mailBodyHtml, // html body
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

/*
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
            if (!stringIsNullOrWhiteSpace(emailAddress[i].email_address) && emailAddress[i].email_address !== 'abco@ciao.it'){
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
*/

/* senza data per non mandare più notifiche di aggiornamento nello stesso giorno 
function notifyUpdateClassfica(stagione) {

    dbCallClassifica.getEmailAddressPartecipanti(stagione).then(function(emailAddress){ //torna una promise
        
        const oggi = new Date();
        const dateString = 
        (oggi.getDate() > 9 ? oggi.getDate() : '0' + oggi.getDate()) +
        '/' + 
        ((oggi.getMonth() + 1) > 9 ? (oggi.getMonth() + 1) : '0' + (oggi.getMonth() + 1)) +
        '/' + 
        oggi.getFullYear();
        
        const mailServer = {
            pool: true, // pooled connections
            maxConnections: 2,
            host: 'smtps.aruba.it',
            port: 465,
            secure: true,
            auth: {
                user: 'sorteggio@legaforum.com',
                pass: 'provalf18'
            }
        };

        const transporter = nodeMailer.createTransport(mailServer);  
        let mails = [];      

        for( let i = 0; i < emailAddress.length; i++){
            
            if (!stringIsNullOrWhiteSpace(emailAddress[i].email_address) && emailAddress[i].email_address !== 'abco@ciao.it'){

                mails.push({                
                    from: 'sorteggio@legaforum.com', // sender address
                    to: emailAddress[i].email_address, // receiver in to
                    envelope: {
                        from: '"Pronostici Lega Forum" <' + 'sorteggio@legaforum.com' + ' >', // sender address
                        to: emailAddress[i].email_address, // receiver in to                        
                    },
                    subject: 'Notifica Aggiornamento Classifica al ' + dateString, // Subject line
                    text: 'La classfica generale è stata aggiornata al ' + dateString +
                        ' controlla la tua posizione : https://pronostici-lega-forum.herokuapp.com ',  // plain text body
                    html: '<b>' + 'La classfica generale è stata aggiornata al ' + dateString + '</b>' + 
                        '<br>' + 
                        'controlla la tua posizione : ' +
                        '<a href="https://pronostici-lega-forum.herokuapp.com">https://pronostici-lega-forum.herokuapp.com</a> ', // html body
                    attachments: []
                });
            }
        }

        for (let x = 0; x < mails.length; x++){

            transporter.sendMail(mails[x], (error, info) => {

                if (error) {
                    console.log(mails[x].to + ' - ' + error);
                }else{
                    console.log(mails[x].to + ' - ' + 'Message %s sent: %s', info.messageId, info.response);
                }
            
            });                 
            
        }

    })
    .catch(error => { //gestione errore
    
        console.log(error);
    
    });

}
*/

function notifyUpdateClassfica(stagione, dataClassifica) {

    let sendNotification = true; 
    const checkData = new Date();
    let dtReturn = checkData.getDate() + '/' + (checkData.getMonth() + 1) + '/' + checkData.getFullYear();

    if ( dataClassifica == '0' ){

        sendNotification = true;
    
    }  else {
    
        if (dataClassifica == dtReturn){

            sendNotification = false;
        
        } else {
      
            dtReturn = checkData.getDate() + '/' + (checkData.getMonth() + 1) + '/' + checkData.getFullYear();
            sendNotification = true;
        
        }
    
    }

    if (sendNotification){

        dbCallClassifica.getEmailAddressPartecipanti(stagione).then(function(emailAddress){ //torna una promise
        
            const oggi = new Date();
            const dateString = 
            (oggi.getDate() > 9 ? oggi.getDate() : '0' + oggi.getDate()) +
            '/' + 
            ((oggi.getMonth() + 1) > 9 ? (oggi.getMonth() + 1) : '0' + (oggi.getMonth() + 1)) +
            '/' + 
            oggi.getFullYear();
            
            const mailServer = {
                pool: true, // pooled connections
                maxConnections: 2,
                host: 'smtps.aruba.it',
                port: 465,
                secure: true,
                auth: {
                    user: 'sorteggio@legaforum.com',
                    pass: 'provalf18'
                }
            };
    
            const transporter = nodeMailer.createTransport(mailServer);  
            let mails = [];      
    
            for( let i = 0; i < emailAddress.length; i++){
                
                if (!stringIsNullOrWhiteSpace(emailAddress[i].email_address) && emailAddress[i].email_address !== 'abco@ciao.it'){
    
                    mails.push({                
                        from: 'sorteggio@legaforum.com', // sender address
                        to: emailAddress[i].email_address, // receiver in to
                        envelope: {
                            from: '"Pronostici Lega Forum" <' + 'sorteggio@legaforum.com' + ' >', // sender address
                            to: emailAddress[i].email_address, // receiver in to                        
                        },
                        subject: 'Notifica Aggiornamento Classifica al ' + dateString, // Subject line
                        text: 'La classfica generale è stata aggiornata al ' + dateString +
                            ' controlla la tua posizione : https://pronostici-lega-forum.herokuapp.com ',  // plain text body
                        html: '<b>' + 'La classfica generale è stata aggiornata al ' + dateString + '</b>' + 
                            '<br>' + 
                            'controlla la tua posizione : ' +
                            '<a href="https://pronostici-lega-forum.herokuapp.com">https://pronostici-lega-forum.herokuapp.com</a> ', // html body
                        attachments: []
                    });
                }
            }
    
            for (let x = 0; x < mails.length; x++){
    
                transporter.sendMail(mails[x], (error, info) => {
    
                    if (error) {
                        console.log(mails[x].to + ' - ' + error);
                    }else{
                        console.log(mails[x].to + ' - ' + 'Message %s sent: %s', info.messageId, info.response);
                    }
                
                });                 
                
            }
    
        })
        .catch(error => { //gestione errore
        
            console.log(error);
        
        });

    }

    return dtReturn;
    
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

/*
function notifyNewSchedina(schedina) {

    dbCallSchedine.getEmailAddressPartecipanti().then(function(emailAddress){ //torna una promise
        
        const oggi = new Date();
        const dateString = 
        (oggi.getDate() > 9 ? oggi.getDate() : '0' + oggi.getDate()) +
        '/' + 
        ((oggi.getMonth() + 1) > 9 ? (oggi.getMonth() + 1) : '0' + (oggi.getMonth() + 1)) +
        '/' + 
        oggi.getFullYear();
        
        let recipients = [];
        for( let i = 0; i < emailAddress.length; i++){
            if (!stringIsNullOrWhiteSpace(emailAddress[i].email_address) && emailAddress[i].email_address !== 'abco@ciao.it'){
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
        subject: 'Notifica apertura nuova Schedina Settimanale Numero ' + schedina.settimana, // Subject line
        text: 'Notifica apertura nuova Schedina Settimanale Numero' + schedina.settimana, // plain text body
        html: '<b>' + 'Notifica apertura nuova Schedina Settimanale Numero' + schedina.settimana + '</b>', // html body
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
*/

function notifyNewSchedina(schedina) {

    dbCallSchedine.getEmailAddressPartecipanti().then(function(emailAddress){ //torna una promise
        
        const mailServer = {
            pool: true,
            maxConnections: 2,
            host: 'smtps.aruba.it',
            port: 465,
            secure: true,
            auth: {
                user: 'sorteggio@legaforum.com',
                pass: 'provalf18'
            }
        };

        const transporter = nodeMailer.createTransport(mailServer);
        let mails = [];     

        for( let i = 0; i < emailAddress.length; i++){

            if (!stringIsNullOrWhiteSpace(emailAddress[i].email_address) && emailAddress[i].email_address !== 'abco@ciao.it'){

                mails.push({                
                    from: 'sorteggio@legaforum.com', // sender address
                    to: emailAddress[i].email_address, // receiver in to
                    envelope: {
                        from: '"Pronostici Lega Forum" <' + 'sorteggio@legaforum.com' + ' >', // sender address
                        to: emailAddress[i].email_address, // receiver in to                        
                    },
                    subject: 'Notifica apertura nuova Schedina Settimanale Numero ' + schedina.settimana, // Subject line
                    text: 'Notifica apertura nuova Schedina Settimanale Numero ' + schedina.settimana + ' ' + 
                    'fai i tuoi pronostici su : ' + 'https://pronostici-lega-forum.herokuapp.com', // plain text body
                    html: '<b>' + 'Notifica apertura nuova Schedina Settimanale Numero ' + schedina.settimana + '</b>' + 
                    '<br>' + 
                    'fai i tuoi pronostici su : ' +
                    '<a href="https://pronostici-lega-forum.herokuapp.com">https://pronostici-lega-forum.herokuapp.com</a> ', // html body                    , // html body
                    attachments: []
                });
        
            }
        
        }

        for (let x = 0; x < mails.length; x++){

            transporter.sendMail(mails[x], (error, info) => {

                if (error) {
                    console.log(error);
                }else{
                    console.log('Message %s sent: %s', info.messageId, info.response);
                }
            
            });                 
            
        }

    })
    .catch(error => { //gestione errore
    
        console.log(error);
    
    });

}

function stringIsNullOrWhiteSpace(str) {
    return (!str || str.length === 0 || /^\s*$/.test(str));
}

module.exports = {

    notifyInsertedProno,
    notifyUpdateClassfica,
    sendRecoverPasswordEmail,
    notifyNewSchedina,
    notifyUserSchedineInsertedProno,
    
};
  